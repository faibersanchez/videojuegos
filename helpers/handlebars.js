module.exports = {
    seleccionarSkills: (seleccionadas = [], opciones) => {
        const skills = ['Todos', 'Todos + 10', 'Adolescentes', 'Maduro + 17',
            'Adultos Unicamente + 18', 'Sin clasificar'
        ];

        let html = '';

        skills.forEach(skill => {
            html += `
                <li ${seleccionadas.includes(skill) ? 'class="activo"':''}>${skill}</li>
            `;
        });

        return opciones.fn().html = html;

    },

    mostrarAlertas: (errores = {}, alertas) => {

        const categoria = Object.keys(errores);

        let html = '';
        if (categoria.length) {
            errores[categoria].forEach(error => {
                html += `<div class="${categoria} alerta">
                ${error}
                </div>`;
            })

        }
        return alertas.fn().html = html;

    }
}