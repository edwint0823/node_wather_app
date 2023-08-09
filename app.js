const {leerInput, inquirerMenu, pausa, listarLugares} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
    let opt;
    const busquedas = new Busquedas()
    do {
        opt = await inquirerMenu()
        switch (opt) {
            case 1:
                const termino = await leerInput('Ciudad: ')
                const lugares = await busquedas.ciudad(termino)
                const id = await listarLugares(lugares)
                if(id === '0') continue
                const lugarSeleccionado = lugares.find(l => l.id === id)
                busquedas.agregarHistorial(lugarSeleccionado.nombre)
                const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng)
                console.clear()
                console.log('\nInformación de la ciudad\n'.green)
                console.log('Ciudad: ', lugarSeleccionado.nombre)
                console.log('Lat: ', lugarSeleccionado.lat)
                console.log('Lng: ', lugarSeleccionado.lng)
                console.log('Temperatura: ', clima.temp)
                console.log('Mínima: ', clima.min)
                console.log('Máxima: ', clima.max)
                console.log('Como se siente', clima.desc.green)
                break
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i ) => {
                    const idx = `${i + 1}.`.green
                    console.log(`${idx} ${lugar}`)
                })
                break
        }
        if (opt !== 0) await pausa()
    } while (opt !== 0)
}

main()