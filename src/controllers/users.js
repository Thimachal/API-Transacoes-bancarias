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
            return res.status(400).json({mensagem: 'Usuário já cadastrado'});
        }
        //criptografa a senha
        const passwordCripto = await bcrypt.hash(senha, 10);

        //query para inserir o usuário no banco de dados
        const queryCad = 'insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *';
        const paramCad = [nome, email, passwordCripto];
        const userCad = await query(queryCad, paramCad);

        if(userCad.rowCount <= 0){
            return res.status(400).json({mensagem: 'Não foi possivel cadastrar o usuário'});
        }
        //desestruturação da query para dar a repsosta sem a senha
        const {senha: _, ...userCadastred} = userCad.rows[0];
        
        return res.status(201).json(userCadastred);
    } catch (error) {
        return res.status(500).json({mensagem: `Erro interno: ${error.message}`});
    }
};

const getUser = async (req, res) => {
    //pega os dados do usuário criado no filter authetication
    //já pega o proprio usuário logado com o req do user criado la no middleware authetocation
    const {user} = req;
    return res.json(user);
};

const updateUser = async (req, res) => {
    //coleta os dados passados na requisição
    const {user} = req;
    const {nome, email, senha} = req.body;

    if(!nome || !email || !senha){
        return res.status(400).json({mensagem: 'Dados inválidos'});
    }

    try {
        //query para pegar o usuário pelo email no banco de dados
        const userOk = await query('select * from usuarios where email = $1', [email]);
        
        //verifica se o usuário existe e se é o mesmo usuário que está logado, pois não pode usar o email de outro usuário
        if(userOk.rowCount > 0 && userOk.rows[0].id !== user.id){
            return res.status(400).json({mensagem: 'Usuário já cadastrado'});
        }

        //criptografa a senha
        const passwordCripto = await bcrypt.hash(senha, 10);


        //query para atualizar o usuário no banco de dados
        const queryUpdate = 'update usuarios set nome=$1, email=$2, senha=$3 where id =$4';
        const paramUpdate = [nome, email, passwordCripto, user.id];
        const userUpdate = await query(queryUpdate, paramUpdate);

        if(userUpdate.rowCount <= 0){
            return res.status(400).json({mensagem: 'Não foi possivel atualizar o usuário'});
        }
              
        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({mensagem: `Erro interno: ${error.message}`});
    }
        


}


module.exports = {
    cadastroUser,
    getUser,
    updateUser
};