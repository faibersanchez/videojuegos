const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slug');
const shortid = require('shortid');

const juegosSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: 'El nombre del juego es obligatorio.',
        trim: true
    },
    precio: {
        type: String,
        trim: true
    },
    calificacion: {
        type: String,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    url: {
        type: String,
        lowercase: true
    },
    skills: [String],

    autor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Usuarios',
        required: 'El autor es requerido'
    }
});
juegosSchema.pre('save', function(next) {
    const url = slug(this.nombre);
    this.url = `${url} - ${shortid.generate()}`
    next();
});

module.exports = mongoose.model('juegos', juegosSchema);