const { request, response } = require("express");
const mongoose = require('mongoose');
require('../config/db');
const Juegos = require('../models/juegos');

const navbarController = {};

navbarController.renderHome = (request, response) => {
    response.render('home')
};

navbarController.renderPanel = async(request, response, next) => {

    const juegos = await Juegos.find();

    if (!juegos) return next();

    response.render('panel', {
        nombrePagina: 'Panel de control',
        barra: true,
        nombre: request.user.nombre,
        juegos
    });
};

navbarController.renderNosotros = (request, response) => {
    response.render('nosotros', {
        nombrePagina: 'Informacion',
        nombre: request.user.nombre,
        barra: true
    });
};

module.exports = navbarController;