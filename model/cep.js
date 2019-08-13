const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CepSchema = new Schema({
    postcode: { type: String, required: true },
    type_address: { type: String },
    address: { type: String },
    neighborhood: { type: String },
    city: { type: String },
    estate: { type: String },
    country: { type: String }
});

module.exports = mongoose.model('Cep',CepSchema);