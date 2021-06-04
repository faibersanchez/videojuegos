const passport = require('passport');
const mongoose = require('mongoose');
require('../config/db');
const Juegos = require('../models/juegos');



const authController = {};

authController.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/panel',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Todos los campos son obligatorios'
});

authController.mostrarPanel = async(request, response) => {
    const juegos = await Juegos.find({ autor: request.user._id });
    response.render('administracion', {
        nombrePagina: 'Administración',
        barra: true,
        nombre: request.user.nombre,
        imagen: request.user.imagen,
        juegos
    });
}

authController.validarUsuario = (request, response, next) => {
    if (request.isAuthenticated()) {

        return next();
    }

    response.redirect('/iniciar-sesion');
}

authController.cerrarSesion = (request, response) => {
    request.logout();
    request.flash('correcto', 'Cerraste sesion correctamente');
    return response.redirect('/');

}

module.exports = authController;