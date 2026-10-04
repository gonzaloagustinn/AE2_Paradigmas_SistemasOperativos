import { test, describe, expect } from "vitest"
import { Simulador } from "../src/Simulador"
import { FirstFit } from "../src/FirstFit"

import type { IConsultaSimulador } from "../src/IConsultaSimulador"
import { EstadodeProceso } from "../src/EstadodeProceso"
import { EventoES } from "../src/EventoES"



describe("configuracion y estado inicial", () => {
    test("la confguracion de referencia que es 1024kb con un quantum 2", () => {
        expect(new Simulador(1024, 2, new FirstFit()).esValido()).toBe(true)

    })

    test("empieza en el tick 0", () => {
        expect(new Simulador(1024, 2, new FirstFit()).getTick()).toBe(0)

    })

    test("empieza con un unico bloque libre que abarca toda la memoria", () =>{

        const simulador = new Simulador(1024, 2, new FirstFit())
        const mapa = simulador.getMapadeMemoria()

       
        expect(mapa.length).toBe(1)
        expect(mapa[0].estaLibre()).toBe(true)
        
        
        expect(mapa[0].getInicio()).toBe(0)
        expect(mapa[0].getTamano()).toBe(1024)
    })

    test("una memoria 0, negativa o decimal no es valida", () =>{
        expect(new Simulador (0, 2, new FirstFit()).esValido()).toBe(false)
       
        expect(new Simulador(-1024, 2, new FirstFit()).esValido()).toBe(false)
        
        expect(new Simulador(10.5, 2, new FirstFit()).esValido()).toBe(false)
    })

    test("un quantum 0 negativo o decimal no es valido", ()=> {
        expect(new Simulador(1024, 0, new FirstFit()).esValido()).toBe(false)
        
        expect(new Simulador(1024, -2, new FirstFit()).esValido()).toBe(false)

        expect(new Simulador(1024, 1.5, new FirstFit()).esValido()).toBe(false)
    })

    test("se puede usar a traves de la interface de consulta al simulador", () =>{
        const consulta: IConsultaSimulador = new Simulador(1024, 2, new FirstFit())

        expect(consulta.getTick()).toBe(0)
    })


})


describe(" registro de procesos", () => {
    test("registra un proceso valido en estado Nuevo", () => {

        const simulador = new Simulador(1024, 2, new FirstFit())

        expect(simulador.registrar(1, 200, 5)).toBe(true)

        const procesos = simulador.getProcesos()
        expect( procesos.length).toBe(1)
        expect(procesos[0].getPid()).toBe(1)
        expect(procesos[0].getEstado()).toBe(EstadodeProceso.Nuevo)
        
    })
})