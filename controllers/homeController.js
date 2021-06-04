exports.mostrarHome = (request, response) => {
    response.render('home', {
        nombrePagina: 'Videojuegos',
    });
}