const {query} = require('../database/connection');
const bcrypt = require('bcrypt');

const listCategories = async (req, res) => {
    try {
        const list = await query('select * from categorias');

        if(list.rowCount <= 0){
            return res.status(400).json({mensagem: 'Não existe categoria cadastrada'});
        }

        return res.status(201).json(list.rows);
    } catch (error) {
        return res.status(500).json({mensagem: `Erro interno: ${error.message}`});
    }
        
};

module.exports = {listCategories}