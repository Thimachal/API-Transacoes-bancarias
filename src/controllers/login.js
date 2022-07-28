const {query} = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');

const login = async (req, res) => {
    const {email, senha} = req.body;

    //verififica se os dados foram passados
    if(!email || !senha){
        return res.status(400).json({mensagem: 'E-mail e senha são obrigatórios'});
    }

    try {
        //query para pegar o usuário pelo email no banco de dados
        const {rowCount, rows} = await query('select * from usuarios where email = $1', [email]);

        //verifica se o usuário existe
        if(rowCount <= 0){
            return res.status(400).json({mensagem: 'Usuário não encontrado'});
        }
        //desestruturação dos dados para pegar apenas a senha
        const [user] = rows; // é mesma coisa de >>>> const user = rows[0];
        
       //compara a senha passada com a senha criptografada do banco de dados
       const passwordCorrect = await bcrypt.compare(senha, user.senha);

       //verifica se a senha está correta
         if(!passwordCorrect){
            return res.status(400).json({mensagem: 'Senha incorreta'});
        }
        //gera o token
        const token = jwt.sign({
            id: user.id
        }, jwtSecret, 
        {expiresIn: '8h'});

        //desestruturação dos dados para pegar o id, nome e email
        const {senha: _, ...userLogin} = user;

        //retorna o user e o token
        return res.status(200).json({
            usuario: userLogin,//o nome usuário é o que vai aparecer no jason
            token
        });
        
     } catch (error) {
        return res.status(500).json({mensagem: `Erro interno: ${error.message}`});
    }
};

module.exports = {login};