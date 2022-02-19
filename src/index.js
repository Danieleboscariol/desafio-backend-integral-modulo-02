const express = require("express");
const app = express();
const roteador=require('./roteador');



app.use(express.json());
app.use(roteador);


const PORTA =3000;
app.listen(PORTA, ()=>{
    console.log('Servidor rodando na porta '+ PORTA);
});

