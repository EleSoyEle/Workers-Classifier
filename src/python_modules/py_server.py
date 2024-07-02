import eventlet
import eventlet.wsgi
from flask import Flask, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
import os
import socketio
from models import *
import xgboost
# Crear una instancia de Flask y configurar CORS
app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas de Flask

# Configurar Socket.IO
sio = socketio.Server(cors_allowed_origins="*")
app.wsgi_app = socketio.WSGIApp(sio, app.wsgi_app)

# Cargar modelos de Machine Learning
neural_n = make_model()
xgb = load_xgb()
path_ckpt = "/home/angelo/test/src/python_modules/nn_checkpoints/"
ckpt = tf.train.Checkpoint(model=neural_n)
latest_ckpt = tf.train.latest_checkpoint(path_ckpt)

if latest_ckpt:
    # Restaurar el último punto de control
    status = ckpt.restore(latest_ckpt)
    # Verificar si la restauración fue exitosa
    status.assert_existing_objects_matched()
    #status.expect_partial()  # si esperas que algunos objetos no se restauren
    print("Pesos cargados correctamente")

# Ruta de prueba para asegurar que Flask está corriendo
@app.route('/')
def index():
    return 'Server is running!'

# Manejar la conexión del cliente
@sio.event
def connect(sid, environ):
    print(f"Client connected: {sid}")
    #sio.emit('message', {'data': 'Welcome!'}, room=sid)

# Manejar mensajes enviados desde el cliente
@sio.event
def message(sid, data):
    print(f"Message from {sid}: {data}")
    cdata = get_values(data)
    nn_pred = np.array(neural_n(np.array(cdata)))[0]
    xgb_pred = xgb.predict(xgboost.DMatrix(data=cdata))
    sio.emit('response',[float(nn_pred),int(xgb_pred)], room=sid)

# Manejar la desconexión del cliente
@sio.event
def disconnect(sid):
    print(f"Client disconnected: {sid}")

# Ejecutar el servidor usando eventlet (compatible con Socket.IO)
if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('0.0.0.0', 5000)), app)
