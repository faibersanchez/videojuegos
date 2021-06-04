const { request, response } = require("express");
const mongoose = require('mongoose');
require('../config/db');
const Usuarios = require('../models/Usuarios');
const multer = require('multer');
const shortid = require('shortid');


const usuariosController = {};

usuariosController.subirImagen = (request, response, next) => {
    /*upload(request, response, function(error) {
        if (error instanceof multer.MulterError) {
            return next();
        }
    });
    next();*/
    upload(request, response, function(error) {
        if (error) {
            if (error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    request.flash('error', 'La imagen es muy grande, máximo 200kb');
                } else {
                    request.flash('error', error.message);
                }
            } else {
                request.flash('error', error.message);
            }
            response.redirect('/editar-perfil');
            return;
        } else {
            return next();
        }
    });
}

const configuracionMulter = {
    limits: { fileSize: 200000 },
    storage: fileStorage = multer.diskStorage({
        destination: (request, file, cb) => {
            cb(null, __dirname + '../../public/uploads/perfiles');
        },
        filename: (request, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(request, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('El formato no es el adecuado'), false);
        }
    }

}

const upload = multer(configuracionMulter).single('imagen');

usuariosController.formCrearCuenta = (request, response) => {
    response.render('crear-cuenta', {
        nombrePagina: 'Crear Cuenta',
        barra: false
    });
}

usuariosController.validarRegistro = (request, response, next) => {
    //Sanitizar
    request.sanitizeBody('nombre').escape();
    request.sanitizeBody('email').escape();
    request.sanitizeBody('password').escape();
    request.sanitizeBody('confirmar').escape();

    //validar
    request.checkBody('nombre', 'El nombre es obligatorio').notEmpty();
    request.checkBody('email', 'El email debe ser válido').isEmail();
    request.checkBody('password', 'El password no puede ir vacío').notEmpty();
    request.checkBody('confirmar', 'Confirmar Password no puede ir vacío').notEmpty();
    request.checkBody('confirmar', 'El Password es diferente').equals(request.body.password);

    const errores = request.validationErrors();

    //Validar errores
    if (errores) {
        request.flash('error', errores.map(error => error.msg));

        response.render('crear-cuenta', {
            nombrePagina: 'Crear Cuenta',
            barra: false,
            mensajes: request.flash(),
        });

    }
    //Si no hay errores - Guardar
    next();
}



usuariosController.crearUsuario = async(request, response, next) => {
    const usuario = new Usuarios(request.body);

    try {
        await usuario.save();
        response.redirect('/iniciar-sesion');
    } catch (error) {
        request.flash('error', error);
        response.redirect('/crear-cuenta');
    }
}

usuariosController.formIniciarSesion = (request, response) => {
    response.render('iniciar-sesion', {
        nombrePagina: 'Iniciar Sesión',
        barra: false
    });
}

usuariosController.formEditarPerfil = (request, response) => {
    response.render('editar-perfil', {
        nombrePagina: 'Editar tu perfil',
        nombre: request.user.nombre,
        imagen: request.user.imagen,
        barra: true,
    });
}

usuariosController.editarPerfil = async(request, response) => {
    const usuario = await Usuarios.findById(request.user._id);

    usuario.nombre = request.body.nombre;
    usuario.email = request.body.email;

    if (request.body.password) {
        usuario.password = request.body.password;
    }

    if (request.file) {
        usuario.imagen = request.file.filename;
    }

    await usuario.save();
    request.flash('correcto', 'Cambios Guardados correctamente');
    response.redirect('/administracion');

}

usuariosController.validarPerfil = (request, response, next) => {
    request.sanitizeBody('nombre').escape();
    request.sanitizeBody('email').escape();

    if (request.body.password) {
        request.sanitizeBody('password').escape();
    }
    //validar

    request.checkBody('nombre', 'Debe agregar un nombre').notEmpty();
    request.checkBody('email', 'Debe colocar un email correcto').notEmpty();

    const errores = request.validationErrors();

    if (errores) {
        request.flash('error', errores.map(error => error.msg));

        response.render('editar-perfil', {
            nombrePagina: 'Editar tu perfil',
            cerrarSesion: true,
            usuario: request.user,
            nombre: request.user.nombre,
            mensajes: request.flash()
        })
    }

    next();
}

usuariosController.verPerfil = (request, response) => {
    response.render('ver-perfil', {
        nombrePagina: 'Tu perfil',
        usuario: request.user,
        nombre: request.user.nombre,
        imagen: request.user.imagen,
        barra: true
    });
}

module.exports = usuariosController;