import axios from 'axios';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.lista-categorias');

    let alertas = document.querySelector('.alertas');

    if (alertas) {
        limpiarAlertas();
    }


    if (skills) {
        skills.addEventListener('click', agregarSkills);
        skillsSeleccionadas();

    }

    const vacantesListado = document.querySelector('.tabla');

    if (vacantesListado) {

        vacantesListado.addEventListener('click', accionesListado);
    }
});

const skills = new Set();
const agregarSkills = e => {
    if (e.target.tagName === 'LI') {
        if (e.target.classList.contains('activo')) {
            skills.delete(e.target.textContent);
            e.target.classList.remove('activo');
        } else {
            skills.add(e.target.textContent);
            e.target.classList.add('activo');
        }
    }
    const skillsArray = [...skills];
    document.querySelector('#skills').value = skillsArray;
}

const skillsSeleccionadas = () => {
    const seleccionadas = Array.from(document.querySelectorAll('.lista-conocimientos .activo'));
    //console.log(seleccionadas);

    seleccionadas.forEach(seleccionada => {
        skills.add(seleccionada.textContent);
    })

    const skillsArray = [...skills];
    document.querySelector('#skills').value = skillsArray;
}

const limpiarAlertas = () => {
    const alertas = document.querySelector('.alertas');

    const interval = setInterval(() => {
        if (alertas.children.length > 0) {
            alertas.removeChild(alertas.children[0]);
        } else if (alertas.children.length === 0) {
            alertas.parentElement.removeChild(alertas);
            clearInterval(interval);
        }
    }, 5000);
}

const accionesListado = e => {
    e.preventDefault();
    //console.log(e.target);

    if (e.target.dataset.eliminar) {
        Swal.fire({
            title: '¿Estas seguro de eliminar la vacante?',
            text: "Estos cambios no se pueden deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButton: 'No, cancelar!',
            confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                const url = `${location.origin}/juegos/eliminar/${e.target.dataset.eliminar}`;
                console.log(url);

                //url para eliminar
                //axios
                axios.delete(url, { params: { url } }).then(function(respuesta) {

                    if (respuesta.status === 200) {
                        Swal.fire(
                            'Juego eliminado',
                            'El juego ha sido eliminada',
                            'success',
                            respuesta.data,
                        );

                        //eliminar la vacante del dom
                        e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);
                    }
                }).catch(() => {
                    Swal.fire({
                        type: 'error',
                        title: 'Hubo un error al eliminar el juego',
                        text: 'No se pudo eliminar el juego'
                    });
                });


            }
        })
    } else if (e.target.tagName === 'A') {

        window.location.href = e.target.href;

    }
}