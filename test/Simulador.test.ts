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

    test("mantiene el orden de registro", () => {
        const simulador = new Simulador(1024, 2, new FirstFit)

        simulador.registrar(2, 100, 3)
        simulador.registrar(1, 100, 3)

        expect(simulador.getProcesos()[0].getPid()).toBe(2)
        expect(simulador.getProcesos()[1].getPid()).toBe(1)
    })

    test("rechaza un pid repetido", () => {
        const simulador = new Simulador (1024, 2, new FirstFit())
        simulador.registrar(1, 100, 3)

        expect(simulador.registrar(1, 200, 4)).toBe(false)
        expect(simulador.getProcesos().length).toBe(1)

    })

    test("rechaza un proceso con datos invalidos", () => {
        const simulador = new Simulador(1024, 2, new FirstFit())

        expect(simulador.registrar(0, 100, 3)).toBe(false)
        expect(simulador.registrar(1, 0, 3)).toBe(false)
        expect(simulador.registrar(1, 100, -3)).toBe(false)
        expect(simulador.getProcesos().length).toBe(0)


    })

    test("con una configuracion invalida no se registra nada", () => {
        const simulador = new Simulador(1024, 0, new FirstFit())
        expect(simulador.registrar(1, 100, 3)).toBe(false)

        expect(simulador.getProcesos().length).toBe(0)
    })


    test("un proceso con evento de entrada y salida valida se registra", () => {

        const simulador = new Simulador(1024, 2, new FirstFit())

        expect(simulador.registrar(1, 100, 5, new EventoES(2, 3))).toBe(true)

    })


    test("un proceso con evento de entrada y salida invalido se rechaza", () => {

        const simulador = new Simulador (1024, 2, new FirstFit())

        expect(simulador.registrar(1, 100, 5, new EventoES(0, 3))).toBe(false)

        expect(simulador.registrar(1, 100, 5, new EventoES(2, -1))).toBe(false)

    })
})


describe("reloj",() => {
    test("cada avance suma un tick", () => {

        const simulador = new Simulador(1024, 2, new FirstFit())

        expect(simulador.avanzarTick()).toBe(1)
        expect(simulador.getTick()).toBe(1)
        expect(simulador.avanzarTick()).toBe(2)
        expect(simulador.getTick()).toBe(2)

    })

    test("con una configuracion invalida le reloj no avanza", () =>{
        const simulador = new Simulador(0, 2, new FirstFit())

        expect(simulador.avanzarTick()).toBe(0)
        expect(simulador.getTick()).toBe(0)

    })
})