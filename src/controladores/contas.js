let { contas, depositos,saques,transferencias } = require('./bancodedados');
const { banco } = require('./bancodedados');
let gerarContas= 1;

function listarContas (req, res){
    const senha = req.query.senha_banco;
  
    if (!senha) {
        return res.status(400).json({mensagem:"Senha é obrigatoria"})
    }
    if (senha !== banco.senha ) {
       return res. status(400).json({mensagem:"Senha Inválida"})
    }
    return res.status(200).json(contas);
} 

function cadastrarConta (req, res){
    const {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha}= req.body;
    
         if (!nome|| 
        !cpf||
        !data_nascimento||
        !telefone||
        !email||
        !senha) {
        return res.status(400).json({mensagem:"Todos os campos são obrigatórios!"})
        }
        const localizarCpf= contas.find(conta=> conta.usuario.cpf === cpf)
        if (localizarCpf) {
            return res.status(400).json({mensagem:"CPF já existe"});
        }
        const localizarEmail= contas.find(conta=> conta.usuario.email === email)
        if (localizarEmail) {
            return res.status(400).json({mensagem:"E mail já existe"});
        }
              
    let novaConta= {
        numero: String(gerarContas++),
        saldo: 0,
        status: true,
        usuario: { 
            nome: nome,
            cpf: cpf,
            data_nascimento: data_nascimento,
            telefone: telefone,
            email: email,
            senha: senha
          }
    }
     contas.push(novaConta);

     return res.status(201).send("conta criada com sucesso");
}

function atualizarConta (req, res){
    const {numeroConta}=req.params;
    
    const {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha}= req.body;
    
        if (!nome|| 
        !cpf||
        !data_nascimento||
        !telefone||
        !email||
        !senha) {
        return res.status(400).json({mensagem:"Todos os campos são obrigatórios!"})
    }
        const contaEncontrada = contas.find(conta => conta.numero === numeroConta);
        if (!contaEncontrada) {
            return res.status(400).json({mensagem:"Conta não Existe!"})
        }
        if (contaEncontrada.usuario.cpf !== cpf) {
           const pesquisaCpf= contas.find(conta=> conta.usuario.cpf === cpf)
           if (pesquisaCpf){ return res.status(400).json({mensagem:"Cpf já Existe em outra Conta Cadastrada!"}) }
        }

        if (contaEncontrada.usuario.email !== email) {
            const pesquisarEmail= contas.find(conta=> conta.usuario.email === email)
            if (pesquisarEmail){ return res.status(400).json({mensagem:"Email já Existe em outra Conta Cadastrada!"})}
         }
       contaEncontrada.nome= nome
        contaEncontrada.cpf= cpf
        contaEncontrada.data_nascimento= data_nascimento
        contaEncontrada.telefone=telefone
        contaEncontrada.email=email
        contaEncontrada.senha=senha
         return res.status(201).send();
}

function deletarConta (req, res){
    const {numeroConta}=req.params;
    let contaEncontrada = contas.find(conta => conta.numero === numeroConta);
    if (!contaEncontrada) {
        return res.status(400).json({mensagem:"Conta não Existe!"})
    }
     if(contaEncontrada.saldo >0){return res.status(400).json({mensagem:"Conta com saldo não pode ser excluida!"})}   
     if(contaEncontrada.saldo <0){return res.status(400).json({mensagem:"Conta com saldo NEGATIVO não pode ser excluida, Você Deve o Banco!!"})}    
    
    contas= contas.filter(conta=>{return conta.numero!==numeroConta})
    contaEncontrada.status= false
     return res.status(200).send();
    }
  
  function consultarSaldo (req, res){
      const {numero_conta,senha}= req.query;
      if(!numero_conta || !senha){
        return res.status(400).json({mensagem:"Preenchimento Obrigatório!"})
      }
        let contaEncontrada = contas.find(conta => conta.numero === numero_conta);
        if (!contaEncontrada) {
            return res.status(400).json({mensagem:"Conta não Existe!"})
        }
        if(contaEncontrada.usuario.senha !== senha){ return res.status(400).json({mensagem:"Senha incorreta!"})}
        return res.status(200).json({saldo:contaEncontrada.saldo})

    } 
    function emitirExtrato(req,res){
        const {numero_conta,senha}= req.query;
        if(!numero_conta || !senha){
            return res.status(400).json({mensagem:"Preenchimento Obrigatório!"})
          }
          let contaEncontrada = contas.find(conta => conta.numero === numero_conta);
          if (!contaEncontrada) {
              return res.status(400).json({mensagem:"Conta não Existe!"})
          }
          if(contaEncontrada.usuario.senha !== senha){ return res.status(400).json({mensagem:"Senha incorreta!"})}
          const depositosRealizados= depositos.filter(conta => conta.numero_conta === numero_conta);
          const saquesRealizados= saques.filter(conta => conta.numero_conta === numero_conta);
          const transferenciasEnviadas= transferencias.filter(conta => conta.numero_conta_origem === numero_conta);
          const transferenciasRecebidas= transferencias.filter(conta => conta.numero_conta_destino === numero_conta);
          
          const extrato= {
              depositos: depositosRealizados,
              saques: saquesRealizados,
              transferenciasEnviadas, 
              transferenciasRecebidas
          }
          
          return res.status(200).json(extrato)
  
    }
      
    
        
         
    

module.exports=
{
    listarContas,
    cadastrarConta,
    atualizarConta,
    deletarConta,
    consultarSaldo,
    emitirExtrato
}