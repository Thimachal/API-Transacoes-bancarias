const {query} = require('../database/connection');
const bcrypt = require('bcrypt');

const listTransactions = async (req, res) => {
    const {user} = req;

    try {
        const list = await query('select * from transacoes where usuario_id = $1', [user.id]);

        return res.json(list.rows);
    } catch (error) {
        return res.status(500).json({mensagem: `Erro interno: ${error.message}`});
    }
}

module.exports = {listTransactions};