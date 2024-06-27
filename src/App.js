import './App.css';
import React, { useState, useEffect } from 'react';
import { questionsList } from './data.js';
import io from 'socket.io-client';

function App() {
  const [index, setIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questionsList.length).fill("Ninguno"));
  const [response, setResponse] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://35.202.201.214:5000',{
      secure:true,
      rejectUnauthorized:false
    });

    newSocket.on("connect", () => {
      console.log("Cliente conectado");
    });

    newSocket.on("message", (data) => {
      console.log("Mensaje recibido,", data);
    });

    newSocket.on("response", (data) => {
      console.log("Respuesta del servidor:", data);
      setResponse(data); // Actualiza el estado response con el número aleatorio
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
      // Aquí puedes realizar alguna validación o procesamiento de los datos del formulario antes de enviarlos al servidor
      const formData = selectedAnswers; // Ejemplo: enviando las respuestas seleccionadas
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
          <div className="App-header">
            <h1>Rellena la información del nuevo empleado</h1>
            <button className="btn btn-primary" onClick={handleClick}>Empezar</button>
          </div>
        </section>
      )}

      {index === 1 && (
        <section>
          <div className="App-header">
            <h3><b>Rellene los datos del formulario</b></h3>
            <div className="row w-75">
              {questionsList.map((questMod, value) => (
                <section key={value} className="col-xxl-4 d-flex align-items-stretch">
                  <div className="colcontainer flex-grow-1 d-flex flex-column">
                    <h4 className="quest-text">{questMod.question}</h4>
                    <select
                      className="form-select mt-auto form-control-sm"
                      aria-label="Multiple select example"
                      defaultValue="Ninguno"
                      onChange={(e) => handleSelectChange(e.target.value, value)}
                    >
                      <option value="Ninguno">Ninguno</option>
                      {questMod.answers.map((questionq, number) => (
                        <option key={number} value={questionq}>{questionq}</option>
                      ))}
                      <br /><br /><br />
                    </select>
                  </div>
                </section>
              ))}
            </div>
            <br />
            <button className="btn btn-primary button_data" onClick={handleClick}>Enviar datos</button>
            <br />
          </div>
        </section>
      )}
      {index === 2 && (
        <div className="App-header">
          {selectedAnswers.length === questionsList.length && selectedAnswers.every(answer => answer !== "Ninguno") ? (
            <section>
              {console.log(selectedAnswers)}
              <p>Datos enviados correctamente. ¡Gracias!</p>
              {response !== null && (
                <section>
                <p>La probabilidad de durar mas de 3 años es: {response*100}% </p>
                </section>
              )}  
            </section>
          ) : (
            <p>Rellena todos los campos</p>
          )}
          
          <button className="btn btn-primary" onClick={() => window.location.reload()}>Volver al inicio</button>
        </div>
      )}
    </div>
  );
}

export default App;
