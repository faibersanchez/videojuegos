const { request, response } = require("express");
const mongoose = require('mongoose');
require('../config/db');
const Juegos = require('../models/juegos');

const panelController = {};



panelController.renderAgregar = (request, response) => {
    response.render('agregar', {
        nombrePagina: 'Agregar Videojuego',
        nombre: request.user.nombre,
        imagen: request.user.imagen,
        barra: true,
    });
}

//Agregar
panelController.agregarJuego = async(request, response) => {
    const juegos = new Juegos(request.body);
    juegos.autor = request.user._id;
    juegos.skills = request.body.skills.split(',');

    const nuevoJuego = await juegos.save()

    response.redirect(`/juegos/${nuevoJuego.url}`);
}

//Listar
panelController.mostrarJuego = async(request, response, next) => {
    const juegos = await Juegos.findOne({ url: request.params.url });

    if (!juegos) return next();

    response.render('juegos', {
        juegos,
        nombrePagina: juegos.nombre,
        nombre: request.user.nombre,
        barra: true
    });
}

//Editar
panelController.FormularioEditarJuego = async(request, response, next) => {
    const juegos = await Juegos.findOne({ url: request.params.url });

    if (!juegos) return next();

    response.render('editar', {
        nombrePagina: `Editar-${juegos.nombre}`,
        juegos,
        barra: true,
        nombre: request.user.nombre,

    });
}

panelController.editarJuego = async(request, response) => {
    const juegoActualizado = request.body;

    juegoActualizado.skills = request.body.skills.split(',');

    const juegos = await Juegos.findOneAndUpdate({ url: request.params.url }, juegoActualizado, {
        new: true,
        runValidators: true
    });

    response.redirect(`/panel`);
}

panelController.validarJuego = (request, response, next) => {
    //Sanitizar
    request.sanitizeBody('nombre').escape();
    request.sanitizeBody('precio').escape();
    request.sanitizeBody('calificacion').escape();
    request.sanitizeBody('skills').escape();

    //validar
    request.checkBody('nombre', 'Debe ingresar un nombre valido').notEmpty();
    request.checkBody('precio', 'Debe ingresar un precio valido').notEmpty();
    request.checkBody('calificacion', 'Debe ingresar una calificacion').notEmpty();
    request.checkBody('skills', 'Debe seleccionar al menos una categoria').notEmpty();

    const errores = request.validationErrors();

    if (errores) {
        request.flash('error', errores.map(error => error.msg));

        response.render('agregar', {
            nombrePagina: 'Agregar Videojuego',
            nombre: request.user.nombre,
            barra: true,
            mensajes: request.flash()
        });
    }

    next();
}

panelController.eliminarJuego = async(request, response) => {
    const { id } = request.params;

    //console.log(id);

    const juegos = await Juegos.findById(id);

    if (verificarAutor(juegos, request.user)) {
        juegos.remove();
        response.status(200).send('Juego eliminado correctamente');
    } else {

        response.status(403).send('Error no se ha podido eliminar el juego');
    }

}
const verificarAutor = (juegos = {}, usuario = {}) => {
    if (!juegos.autor.equals(usuario._id)) {
        return false;
    }

    return true;
}

module.exports = panelController;