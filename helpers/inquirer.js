const inquirer = require('inquirer');
require('colors')
const menuOpts = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Que desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            },

        ]
    }
]
const inquirerMenu = async () => {
    console.clear()
    console.log('======================================'.green)
    console.log('       Seleccione una opción'.white)
    console.log('======================================\n'.green)
    const {opcion} = await inquirer.prompt(
        menuOpts
    )
    return opcion
}

const pausa = async () => {
    const question = [
        {
            type: 'input',
            name: 'pausa',
            message: `Presione ${'enter'.green} para continuar`,
        }
    ]
    console.log('\n')
    return await inquirer.prompt(question)
}

const leerInput = async (message) => {
    const question = {
        type: 'input',
        name: 'desc',
        message,
        validate(value) {
            if (!value.length) {
                return 'Por favor ingrese un valor'
            }
            return true
        }
    }
    const {desc} = await inquirer.prompt(question)
    return desc
}

const listarLugares = async (lugares = []) => {
    const choices = lugares.map(({id, nombre}, i) => {
        const idx = `${i + 1}.`.green
        return {
            value: id,
            name: `${idx} ${nombre}`
        }
    })
    choices.unshift({
        value: '0',
        name: `${'0.'.green} Cancelar`
    })
    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione',
            choices
        }
    ]
    const {id} = await inquirer.prompt(
        preguntas
    )
    return id
}

const confirmar = async (message) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ]
    const {ok} = await inquirer.prompt(question)
    return ok
}

const mostrarListadoCheckList = async (tareas = []) => {
    const choices = tareas.map(({id, desc, completadoEn}, i) => {
        const idx = `${i + 1}.`.green
        return {
            value: id,
            name: `${idx} ${desc}`,
            checked: !!completadoEn
        }
    })
    const preguntas = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione',
            choices
        }
    ]
    const {ids} = await inquirer.prompt(
        preguntas
    )
    return ids
}

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoCheckList
}