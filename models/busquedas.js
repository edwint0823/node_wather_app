const fs = require('fs')
require('dotenv').config()
const axios = require('axios')

class Busquedas {
    historial = []
    dbPath = './db/database.json'

    constructor() {
        this.leerDB()
    }

    get historialCapitalizado() {
        return this.historial.map(l =>{
            let palabras = l.split(' ')
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1))
            return palabras.join(' ')
        })
    }

    get paramsMapbox() {
        return {
            language: 'es',
            limit: 5,
            'access_token': process.env.MAPBOX_KEY
        }
    }

    get paramsWeather() {
        return {
            'APPID': process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    async ciudad(lugar = '') {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            })
            const resp = await instance.get()
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }))
        } catch (error) {
            return []
        }
    }

    async climaLugar(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {
                    lat,
                    lon,
                    ...this.paramsWeather
                }
            })
            const resp = await instance.get()
            const {weather, main} = resp.data
            const {temp_min, temp_max, temp} = main
            return {
                desc: weather[0].description,
                min: temp_min,
                max: temp_max,
                temp
            }
        } catch (error) {
            console.log('no se encontro la ciudad', error)
            return {}
        }
    }

    agregarHistorial(lugar = '') {
        if (this.historial.includes(lugar.toLowerCase())) return;
        this.historial = this.historial.splice(0,5)
        this.historial.unshift(lugar.toLowerCase())
        this.guardarDB()
    }

    guardarDB() {
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    leerDB() {
        if (!fs.existsSync(this.dbPath)) return
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf8'})
        const {historial} = JSON.parse(info)
        this.historial = historial
    }
}

module.exports = Busquedas