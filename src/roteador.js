const express= require("express");
const roteador= express();
const contas= require('./controladores/contas')
const transacoes= require('./controladores/transacoes')

roteador.get('/contas', contas.listarContas);
roteador.post('/contas', contas.cadastrarConta);
roteador.put('/contas/:numeroConta/usuario',contas.atualizarConta);
roteador.delete('/contas/:numeroConta/usuario',contas.deletarConta);
roteador.get ('/contas/saldo',contas.consultarSaldo);
 roteador.get ('/contas/extratos',contas.emitirExtrato);


roteador.post('/transacoes/depositar',transacoes.depositarValores);
 roteador.post ('/transacoes/sacar',transacoes.sacarValores);
roteador.post ('/transacoes/transferir',transacoes.transferirValores);



module.exports= roteador;