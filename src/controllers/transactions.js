const {query} = require('../database/connection');

const listTransactions = async (req, res) => {
    const {user} = req;

    try {
        const list = await query('select * from transacoes where usuario_id = $1', [user.id]);

        return res.json(list.rows);
    } catch (error) {
        return res.status(500).json({mensagem: `Erro interno: ${error.message}`});
    }
};

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

};

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
        
        const categoria = await query('select * from categorias where id = $1', [categoria_id]);

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

const updateTransaction = async (req, res) => {
    const {user} = req;
    const {id} = req.params;
    const {descricao, valor, data, categoria_id, tipo} = req.body;

    if(!descricao || !valor || !data || !categoria_id || !tipo) {
        
        return res.status(404).json({mensagem:'Todos os campos obrigatórios devem ser informados.'});
    }  
    if(tipo !== 'entrada' && tipo !== 'saida'){
        return res.status(404).json({mensagem:'Tipo de transação inválida.'});
    }

    try {

        const transaction = await query('select * from transacoes where usuario_id = $1 and id = $2', [user.id, id]);

        if(transaction.rowCount <= 0){
            return res.status(404).json({mensagem: 'Transação não encontrada'});
        }

        const category = await query('select * from categorias where id = $1', [categoria_id]);

        if(category.rowCount <= 0) {
            return res.status(404).json({mensagem:'Categoria não encontrada.'});
        }

        const queryUpdate = 'update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 where id = $6';
        const paramUpdate = [descricao, valor, data, categoria_id, tipo, id];
        const transactionUpdated = await query(queryUpdate, paramUpdate);

        if(transactionUpdated.rowCount <= 0){
            return res.status(404).json({mensagem: `Erro interno: ${error.message}`});
        }

        return res.status(204).send();
        
    } catch (error) {
        return res.status(500).json({mensagem: `Erro interno: ${error.message}`});
    }

};

const deleteTransaction = async (req, res) => {
    const {user} = req;
    const {id} = req.params;

    try {

        const transaction = await query('select * from transacoes where usuario_id = $1 and id = $2', [user.id, id]);

        if(transaction.rowCount <= 0){
            return res.status(404).json({mensagem: 'Transação não encontrada'});
        }

        const queryTransactionDelete =  await query('delete from transacoes where id = $1', [id]);

        if(queryTransactionDelete.rowCount <= 0){
            return res.status(404).json({mensagem: `Erro interno: ${error.message}`});
        }

        return res.status(204).send();
        
    } catch (error) {
        return res.status(500).json({mensagem: `Erro interno: ${error.message}`});
    }
};

const consultExtract = async (req, res) => {
    const {user} = req;

    try {
        const queryExtract = 'select sum(valor) as saldo from transacoes where usuario_id = $1 and tipo = $2';
        const saldoEntrada = await query(queryExtract, [user.id, 'entrada']);
        const saldoSaida = await query(queryExtract, [user.id, 'saida']);

        return res.json({
            entrada: Number(saldoEntrada.rows[0].saldo) ?? 0,
            saida: Number(saldoSaida.rows[0].saldo) ?? 0
        });
    } catch (error) {
        return res.status(500).json({mensagem: `Erro interno: ${error.message}`});
    }
};
module.exports = {listTransactions, detailTransaction, cadastroTransaction, updateTransaction, deleteTransaction, consultExtract};