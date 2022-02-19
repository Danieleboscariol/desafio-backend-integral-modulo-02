let { contas,depositos,saques,transferencias} = require('./bancodedados');
const {format}= require('date-fns') 


const depositarValores= (req, res)=>{
    const{ numero_conta, valor}=req.body
    const contaEncontrada = contas.find(conta => conta.numero === numero_conta);
    if (!contaEncontrada) {
        return res.status(400).json({mensagem:"Conta não Existe!"})
    }
    if(!numero_conta || !valor){return res.status(400).json({mensagem:"Preenchimento Obrigatório!"})}
    if( valor<=0){return res.status(400).json({mensagem:"Não é permitido valor zerado ou negativo!"})}
    if(contaEncontrada.status === false){return res.status(400).json({mensagem:"Conta não acessivel!"})}
    contaEncontrada.saldo= contaEncontrada.saldo+valor;

    let registroDeDeposito={
        data:format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta,
        valor
    }

    depositos.push(registroDeDeposito)
    return res.status(200).send(depositos)
}

const sacarValores=( req, res)=>{
    const{ numero_conta, valor,senha}=req.body
    const contaEncontrada = contas.find(conta => conta.numero === numero_conta);
    if (!contaEncontrada) {
        return res.status(400).json({mensagem:"Conta não Existe!"})
    }
    if(!numero_conta || !valor ||!senha){return res.status(400).json({mensagem:"Preenchimento Obrigatório!"})}
    const validarSenha = contas.find(conta => conta.usuario.senha === senha);  
    if(!validarSenha){
        return res.status(400).json({mensagem:"Senha Incorreta"})
    }
    if( valor > contaEncontrada.saldo){ return res.status(400).json({mensagem:"Saldo Insuficiente!"})}
    contaEncontrada.saldo= contaEncontrada.saldo-valor;
    
    let registroDeSaque={
        data:format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta,
        valor
    }

    saques.push(registroDeSaque)
    return res.status(200).send()


    }

 const transferirValores= (req, res)=>{
    const{ numero_conta_origem,numero_conta_destino, valor,senha}=req.body

    if(!numero_conta_origem || !numero_conta_destino|| !valor ||!senha){return res.status(400).json({mensagem:"Preenchimento Obrigatório!"})}

    const conta_origem = contas.find(conta => conta.numero === numero_conta_origem);  
    if(!conta_origem){
        return res.status(400).json({mensagem:"Conta de origem Incorreta"})
    }
    const conta_destino= contas.find(conta => conta.numero === numero_conta_destino);  
    if(!conta_destino){
        return res.status(400).json({mensagem:"Conta de destino Incorreta"})
    }
    if(conta_origem.usuario.senha !== senha){
        return res.status(400).json({mensagem:"Senha Incorreta"})}

     if( valor > conta_origem.saldo){ return res.status(400).json({mensagem:"Saldo Insuficiente!"})}
        conta_origem.saldo= conta_origem.saldo-valor; 
        conta_destino.saldo= conta_destino. saldo+valor;

        let registroDeTransferencia={
            data:format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            numero_conta_origem,
            numero_conta_destino,
            valor
        }
    
        transferencias.push(registroDeTransferencia)
        return res.status(200).send()
    
        

    

 }   
module.exports=
{
    depositarValores,
    sacarValores,
    transferirValores

}