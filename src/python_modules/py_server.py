import socketio
import eventlet
import eventlet.wsgi
from flask import Flask, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
import os
from models import make_model

neural_n = make_model()

#Una vez entrenado el modelo debemos guardar los pesos
ckpt_path = "/content/checkpoints/"
ckpt_j = os.path.join(ckpt_path,"ckpt")
ckpt = tf.train.Checkpoint(
    model=neural_n,
)


# Crear una instancia de Flask y SocketIO
app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas
sio = socketio.Server(cors_allowed_origins="*")
app.wsgi_app = socketio.WSGIApp(sio, app.wsgi_app)

# Ruta de prueba para asegurar que Flask está corriendo
@app.route('/')
def index():
    return 'Server is running!'

# Manejar la conexión del cliente
@sio.event
def connect(sid, environ):
    print(f"Client connected: {sid}")
    sio.emit('message', {'data': 'Welcome!'}, room=sid)

# Manejar mensajes enviados desde el cliente
@sio.event
def message(sid, data):
    print(f"Message from {sid}: {data}")
    
    if len(data)==4:
        adata = np.array([int(d) for d in data]).reshape(-1,4)
        pred = neural_n(adata,training=False)
        pred = np.array(pred).reshape(-1)
        # Enviar el número aleatorio al cliente
        sio.emit('response', int(pred[0].round()), room=sid)

# Manejar la desconexión del cliente
@sio.event
def disconnect(sid):
    print(f"Client disconnected: {sid}")

# Ejecutar el servidor
if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('192.168.100.10', 5000)), app)
