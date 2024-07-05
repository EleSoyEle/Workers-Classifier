# Proyecto integrador final
En este proyecto se hace presentación de un programa que tiene como proposito evaluar si un trabajador va a durar mas de 3 años o no, mediante algoritmos de machine learning.
![image](/pimage1.png)


## Modelos de machine learning usados
Se entrenaron varios modelos, pero se usaron dos debido a que eran los mas eficientes.
* Una neural network en tensorflow
* Un modelo xgboost

Estos modelos resultaron ser los mas eficientes a la hora de predecir si un trabajador va a durar 3 años o no.

## El sistema de servidores
Nuestro sistema consta de dos servidores, uno que se ejecuta en python y otro en javascript.
El servidor python es el encargado de procesar los modelos, mientras que el serviodr javascript se encarga de frontend, en particular en esta herramienta usamos react para renderizar todo.
![Imagen de los servidores](/Frontend.png)

## Informacion adicional
Para que la pagina web de resultados de los modelos, el servidor python debe estar encendido, el servidor react esta alojado en vercel. Por lo que es posible acceder a la pagina en cualquier momento.