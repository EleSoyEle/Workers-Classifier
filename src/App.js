import './App.css';
import React, { useState, useEffect } from 'react';
import { questionsList } from './data.js';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';

function make_header(){
  return (
    <section>
      <nav class="navbar navbar-dark bg-dark">
        <div class="container">
          <a class="navbar-brand mb-0 h1" href="/">Workdev</a>
        </div>
    </nav>
    </section>
  );

}


function App() {
  const [index, setIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questionsList.length).fill("Ninguno"));
  const [response, setResponse] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    //Ip del servidor
    const newSocket = io('https://7a66-187-189-15-33.ngrok-free.app');

    newSocket.on("connect", () => {
      console.log("Cliente conectado");
    });

    newSocket.on("message", (data) => {
      console.log("Mensaje recibido,", data);
    });

    newSocket.on("response", (data) => { 
      console.log("Respuesta del servidor:", data);
      setResponse(data); // Actualiza el response con la prediccion(data)
    });

    newSocket.on("disconnect", () => {
      console.log("Cliente desconectado");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleClick = () => {
    if (index === 1) {
      const formData = selectedAnswers;
      socket.emit("message", formData);
      setIndex(2); // Cambia el estado index después de enviar los datos
    } else {
      setIndex(index + 1);
    }
  };

  const handleSelectChange = (value, selectedIndex) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[selectedIndex] = value;
    setSelectedAnswers(newSelectedAnswers);
  };

  if (!socket) {
    return null; // Muestra un loader o mensaje mientras se establece la conexión
  }

  return (
    <div className="App">
      {index === 0 && (
        <section>
          {make_header()}
          <div className="App-header">
            <h1 className='display-6'><b>¿Cuanto va a durar un trabajador?</b></h1>
          
            <div className='container'>
              <p class="lead"><small>Bienvenido a nuestra herramienta de predicción de retención de empleados.Con nuestra aplicación, puedes anticipar si un trabajador permanecerá en tu empresa por más de tres años. Utilizamos modelos avanzados de aprendizaje automático para analizar datos clave y proporcionar predicciones precisas.</small></p>
              <hr></hr>
              <p>Ingresa la informacion para ver los resultados de nuestros modelos</p>
              <button className="btn btn-primary" onClick={handleClick}>Empezar</button>
            </div>
          </div>
        </section>
      )}

      {index === 1 && (
        <section>
        {make_header()}
        <div className="App-header">
        <h3 className='display-6'>Ingresa los datos del trabajador</h3>
          
          <div className="row w-75">
            {questionsList.map((questMod, value) => (
              <section key={value} className="col-xxl-4 d-flex align-items-stretch mb-3">
                <div className="colcontainer flex-grow-1 d-flex flex-column">
                  <p className='lead quest-text mb-2'>{questMod.question}</p>
                  <select
                    className="form-select form-select-sm mt-auto"
                    aria-label="Multiple select example"
                    defaultValue="Ninguno"
                    onChange={(e) => handleSelectChange(e.target.value, value)}>
                    <option value="Ninguno">Ninguno</option>
                    {questMod.answers.map((questionq, number) => (
                      <option key={number} value={questionq}>{questionq}</option>
                    ))}
                  </select>
                </div>
              </section>
            ))}
          </div>
          <button className="btn btn-primary button_data mt-3" onClick={handleClick}>Enviar datos</button>
          <p className='lead'>Asegúrese de ingresar la información correcta para obtener los mejores resultados.</p>
        </div>
      </section>      
      )}
      {index === 2 && (
        <section>
          {make_header()}
          <div className="App-header">
            {selectedAnswers.length === questionsList.length && selectedAnswers.every(answer => answer !== "Ninguno") ? (
              <section>
                {console.log(selectedAnswers)}
                <h3 className='display-6'>Resultados</h3>
                <hr></hr>
                {response !== null && (
                  <section>
                  <p className='lead quest-text'>Resultados de cada modelo:</p>
                  <p className='lead quest-text'>Neural network: {response[0].toFixed(2)*100}%</p>
                  <p className='lead quest-text'>Xgboost: {response[1]*100}%</p>
                  </section>
                )}  
              </section>
            ) : (
              <p className='lead'>Rellena todos los campos</p>
            )}
            
            <button className="btn btn-primary" onClick={() => window.location.reload()}>Volver al inicio</button>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
