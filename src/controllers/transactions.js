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

const detailTransaction = async (req, res) => {
    const {user} = req;
    const {id} = req.params;

    try {
        const {rowCount, rows} = await query('select * from transacoes where usuario_id = $1 and id = $2', [user.id, id]);

        if(rowCount <= 0){
            return res.status(404).json({mensagem: 'Transação não encontrada'});
        }

        const [transaction] = rows;
        return res.json(transaction);

    } catch (error) {
        return res.status(500).json({mensagem: `Erro interno: ${error.message}`});
    }

}

module.exports = {listTransactions, detailTransaction};