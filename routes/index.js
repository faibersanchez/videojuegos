//Importacion express para el control de rutas o URL
const { request, response } = require('express');
const express = require('express');


//Llamar el método que controla las rutas
const router = express.Router();

const homeController = require('../controllers/homeController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');
const panelController = require('../controllers/panelController');
const navbarController = require('../controllers/navbarController');

//Mejorar las peticiones al servidor
module.exports = () => {
    router.get('/', homeController.mostrarHome);

    router.get('/home', navbarController.renderHome);

    router.get('/panel', navbarController.renderPanel);

    router.get('/nosotros', navbarController.renderNosotros);

    //Crear cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);

    router.post('/crear-cuenta', usuariosController.validarRegistro, usuariosController.crearUsuario);

    //Agregar
    router.get('/agregar', authController.validarUsuario, panelController.renderAgregar);

    router.post('/agregar', authController.validarUsuario, panelController.validarJuego, panelController.agregarJuego);

    //Listar
    router.get('/juegos/:url', panelController.mostrarJuego);

    //Editar
    router.get('/editar/:url', authController.validarUsuario, panelController.FormularioEditarJuego);

    //Guardar Edicion
    router.post('/editar/:url', authController.validarUsuario, panelController.validarJuego, panelController.editarJuego);

    //Eliminar vacante
    router.delete('/juegos/eliminar/:id', authController.validarUsuario, panelController.eliminarJuego);

    //Iniciar sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);

    router.post('/iniciar-sesion', authController.autenticarUsuario);

    //cerrar Session
    router.get('/cerrar-sesion', authController.validarUsuario, authController.cerrarSesion);

    //Administración
    router.get('/administracion', authController.validarUsuario, authController.mostrarPanel);


    //editar perfil
    router.get('/editar-perfil', authController.validarUsuario, usuariosController.formEditarPerfil);

    router.post('/editar-perfil', authController.validarUsuario, /*usuariosController.validarPerfil,*/ usuariosController.subirImagen, usuariosController.editarPerfil);

    //Ver perfil
    router.get('/ver-perfil', usuariosController.verPerfil);

    return router;

}