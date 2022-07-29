const {query} = require('../database/connection');
const bcrypt = require('bcrypt');

const cadastroUser = async (req, res) => {
    //coleta os dados passados na requisição
    const {nome, email, senha} = req.body;
    //verifica se os dados foram passados
    if(!nome || !email || !senha){
            return res.status(400).json({mensagem: 'Dados inválidos'});
    }

    try {
        //query para pegar o usuário pelo email no banco de dados
        const user = await query('select * from usuarios where email = $1', [email]);

        //verifica se o usuário existe
        if(user.rowCount > 0){
            return res.status(400).json({'mensagem': 'Usuário já cadastrado'});
        }
        //criptografa a senha
        const passwordCripto = await bcrypt.hash(senha, 10);

        //query para inserir o usuário no banco de dados
        const queryCad = 'insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *';
        const paramCad = [nome, email, passwordCripto];
        const userCad = await query(queryCad, paramCad);

        if(userCad.rowCount <= 0){
            return res.status(400).json({'mensagem': 'Não foi possivel cadastrar o usuário'});
        }
        //desestruturação da query para dar a repsosta sem a senha
        const {senha: _, ...userCadastred} = userCad.rows[0];
        
        return res.status(201).json(userCadastred);
    } catch (error) {
        return res.status(500).json({mensagem: `Erro interno: ${error.message}`});
    }
};

const getUser = async (req, res) => {
    const {user} = req;
    return res.json(user);
};


module.exports = {
    cadastroUser,
    getUser
};