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

const cadastroTransaction = async (req, res) => {
    const {user} = req;
    const {descricao, valor, data, categoria_id, tipo} = req.body;
    
    if(!descricao || !valor || !data || !categoria_id || !tipo) {
        
        return res.status(404).json({mensagem:'Todos os campos obrigatórios devem ser informados.'});
    }  
    if(tipo !== 'entrada' && tipo !== 'saida'){
        return res.status(404).json({mensagem:'Tipo de transação inválida.'});
    }

    try {
        
        const queryCategoria = 'select * from categorias where id = $1';
        const categoria = await query(queryCategoria, [categoria_id]);

        if(categoria.rowCount <= 0) {
            return res.status(404).json({mensagem:'Categoria não encontrada.'});
        }

        const queryCad = 'insert into transacoes (descricao, valor, data, categoria_id, tipo, usuario_id) values ($1, $2, $3, $4, $5, $6) returning *';
        const transactionCad = [descricao, valor, data, categoria_id, tipo, user.id];
        const {rowCount, rows} = await query(queryCad,transactionCad);
        

        if(rowCount <= 0){
            return res.status(404).json({mensagem:'Erro ao cadastrar transação.'});
        }

        //só está usando o rows aqui pois tem o returning* na linha 57
        const [transaction] = rows;
        transaction.categoria_nome = categoria.rows[0].descricao;
        return res.status(200).json(transaction);

    } catch (error) {
        return res.status(500).json({mensagem: `Erro interno: ${error.message}`});
    }

};
module.exports = {listTransactions, detailTransaction, cadastroTransaction};