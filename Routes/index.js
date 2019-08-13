const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

router.get('/',(req,res) => {
    return res.send({message:'Funcionando!'});
});

router.post('/',(req,res) => {
    return res.send({message:'Tudo ok com o metodo POST da raiz!'});
});

module.exports = router;