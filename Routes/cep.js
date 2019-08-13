const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Cep = require('../model/cep');
const curl = new (require( 'curl-request' ))();
const auth = require('../middlewares/auth');

//Funções auxiliares
function strpos (haystack, needle, offset) {
    var i = (haystack+'').indexOf(needle, (offset || 0));
    return i === -1 ? false : i;
}

const typeAddress = (logradouro) => {
    var type = '';
    var address = logradouro.toLowerCase();

    if (strpos(address, 'acesso') !== false) {
        type = 'Acesso';
    }

    if (strpos(address, 'rua') !== false) {
        type = 'Rua';
    }

    if (strpos(address, 'avenida') !== false) {
        type = 'Avenida';
    }

    if (strpos(address, 'estancia') !== false) {
        type = 'Estancia';
    }

    if (strpos(address, 'travessa') !== false) {
        type = 'Travessa';
    }

    if (strpos(address, 'alameda') !== false) {
        type = 'Alameda';
    }

    if (strpos(address, 'estrada') !== false) {
        type = 'Estrada';
    }

    if (strpos(address, 'praça') !== false) {
        type = 'Praça';
    }

    if (strpos(address, 'praça') !== false) {
        type = 'Praça';
    }

    if (strpos(address, 'acampamento') !== false) {
        type = 'Acampamento';
    }

    return type
}

router.get('/:postcode', auth, async (req,res) => {
    try {
        var postcode = req.params.postcode.replace('-',''); 
        var resultCep = await Cep.findOne({postcode});
        if(!resultCep){
            curl.setHeaders([
                'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
            ])
            .get(`https://viacep.com.br/ws/${postcode}/json/`)
            .then( async ({body}) => {
                var result = await JSON.parse(body);

                if(result.erro == true) return res.status(404).send('Erro ao buscar o CEP'); 
                if(!result) return res.status(404).send('CEP não encontrado');
            
                if(result.hasOwnProperty('localidade')){
                    var cepInfo = new Object();
                    cepInfo['postcode'] = postcode;
                    cepInfo['type_address'] = typeAddress(result.logradouro);
                    cepInfo['address'] = result.logradouro.replace(typeAddress(result.logradouro)+' ','');
                    cepInfo['neighborhood'] = result.bairro;
                    cepInfo['city'] = result.localidade;
                    cepInfo['estate'] = result.uf.toUpperCase();
                    cepInfo['country'] = 'Brasil';
                    resultCep = await Cep.create(cepInfo);
                    if(!resultCep) return res.status(500).send('Erro interno');
                    else return res.status(200).send(resultCep);
                } else {
                    return res.status(404).send('CEP nao encontrado');
                }
            })
            .catch((e) => {
                console.log(e);
                return res.status(500).send('Erro interno');
            });
        } else {
            return res.status(200).send(resultCep);
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).send({ error: 'Erro na consulta do CEP'});
    }
});

router.post('/multiplesCep', async (req,res) => {
    try {
        var {postcode, type_address , address, neighborhood, city, estate, country} = req.body;
        if(!postcode || !type_address || !address || !neighborhood || !city || !estate || !country ) return res.status(400).send({error: 'Dados insuficientes'});

        postcode = postcode.replace('-',''); 
        try {
            var resultCep = await Cep.findOne({postcode});
            if(!resultCep){
                var cepInfo = new Object();
                cepInfo['postcode'] = postcode;
                cepInfo['type_address'] = typeAddress(type_address);
                cepInfo['address'] = address;
                cepInfo['neighborhood'] = neighborhood;
                cepInfo['city'] = city;
                cepInfo['estate'] = estate.toUpperCase();
                cepInfo['country'] = 'Brasil';
                resultCep = await Cep.create(cepInfo);
                if(!resultCep) return res.status(500).send('Erro interno');
                else return res.status(200).send(resultCep);
            } else {
                return res.status(500).send('CEP ja cadastrado na base de dados');
            }
        } catch (err){
            if(err) return res.status(500).send({ error: 'Erro ao buscar usuario '});
        }
    } catch(err){
        console.log(err);
        return res.status(500).send({ error: 'Erro ao salvar o CEP'});
    }
});

module.exports = router;