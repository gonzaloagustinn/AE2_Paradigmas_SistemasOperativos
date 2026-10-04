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


describe("admision y asignacion de memoria", () => {
    test("al avanzar el tick se asigna memoria a los proceso y quedan listos", () => {
        const simulador = new Simulador(1024, 2, new FirstFit())

        simulador.registrar(1, 200, 5)
        simulador.registrar(2, 200, 5)

        simulador.avanzarTick()


        const mapa = simulador.getMapadeMemoria()
        expect(mapa.length).toBe(3)
        expect(mapa[0].getPidAsignado()).toBe(1)
        expect(mapa[1].getPidAsignado()).toBe(2)
        expect(mapa[1].getInicio()).toBe(200)
        expect(mapa[1].getTamano()).toBe(200)
        expect(mapa[2].estaLibre()).toBe(true)
        expect(mapa[2].getTamano()).toBe(624)
        expect(simulador.getProcesos()[1].getEstado()).toBe(EstadodeProceso.Listo)

    })

    test("sin bloque suficiente el proceso queda esperando memoria", () => {
        const simulador = new Simulador(1000, 2, new FirstFit())
        simulador.registrar(1, 800, 5)
        simulador.registrar(2, 500, 5)


        simulador.avanzarTick()



        expect(simulador.getProcesos()[1].getEstado()).toBe(EstadodeProceso.Esperando_Memoria)
        expect(simulador.getMapadeMemoria().length).toBe(2)

    })

    test(" un proceso que entre en el espacio se admite unque otro anterior este esperando" , () => {

        const simulador = new Simulador(1000, 2, new FirstFit())
        simulador.registrar(1, 800, 5)
        simulador.registrar(2, 500, 5)
        simulador.registrar(3, 100, 5)

        simulador.avanzarTick()


        expect(simulador.getProcesos()[1].getEstado()).toBe(EstadodeProceso.Esperando_Memoria)

        expect(simulador.getProcesos()[2].getEstado()).toBe(EstadodeProceso.Listo)
        expect(simulador.getMapadeMemoria()[1].getPidAsignado()).toBe(3)

    })
})

describe(" round robin con quantum 2", () => {
    test("p1 - cpu 3 y p2 - cpu 2 se ejecutan p1, 1, 2, 2, 1", () =>{
        const simulador = new Simulador(1024, 2, new FirstFit())

        simulador.registrar(1, 100, 3)
        simulador.registrar(2, 100, 2)

        const p1 = simulador.getProcesos()[0]
        const p2 = simulador.getProcesos()[1]

        simulador.avanzarTick()

        expect([p1.getCpuRestante(), p2.getCpuRestante()]).toEqual([2, 2])

        simulador.avanzarTick()
        expect([p1.getCpuRestante(), p2.getCpuRestante()]).toEqual([1, 2])

        simulador.avanzarTick()
        expect([p1.getCpuRestante(), p2.getCpuRestante()]).toEqual([1, 1])


        simulador.avanzarTick()
        expect([p1.getCpuRestante(), p2.getCpuRestante()]).toEqual([1, 0])


        simulador.avanzarTick()
        expect([p1.getCpuRestante(), p2.getCpuRestante()]).toEqual([0, 0])




        
    })


    test("un unico proceso se ejecuta sin interrupciones hasta terminar", () => {
        const simulador = new Simulador(1024, 2, new FirstFit())

        simulador.registrar(1, 100, 3)

        const p1 = simulador.getProcesos()[0]


        simulador.avanzarTick()
        simulador.avanzarTick()
        simulador.avanzarTick()

        expect(p1.getCpuRestante()).toBe(0)
        expect(p1.getEstado()).toBe(EstadodeProceso.Terminado)

    })
})

describe("liberar memoria al terminar ", () => {

    test("al terminar el proceso libera su memoria en ese mismo tick", () => {
    
        const simulador = new Simulador(1024, 2, new FirstFit())
    
        simulador.registrar(1, 100, 1)

        simulador.avanzarTick()

    
        expect(simulador.getProcesos()[0].getEstado()).toBe(EstadodeProceso.Terminado)
    
        expect(simulador.getMapadeMemoria().length).toBe(1)
    
        expect(simulador.getMapadeMemoria()[0].estaLibre()).toBe(true)
        expect(simulador.getMapadeMemoria()[0].getTamano()).toBe(1024)
    })

    test("la memoria liberada se ofrece al proceso en espera en el tick siguiente", () => {
        
        const simulador = new Simulador(1000, 5, new FirstFit())
        
        
        simulador.registrar(1, 800, 1)
        
        simulador.registrar(2, 500, 2)
        const p2 = simulador.getProcesos()[1]

        simulador.avanzarTick()
        
        expect(simulador.getProcesos()[0].getEstado()).toBe(EstadodeProceso.Terminado)
        expect(p2.getEstado()).toBe(EstadodeProceso.Esperando_Memoria)

        simulador.avanzarTick()
        expect(p2.getEstado()).toBe(EstadodeProceso.Ejecutando)
        
        expect(p2.getCpuRestante()).toBe(1)
    })

    test("otro proceso no se ejecuta en el mismo tick en que otro termina", () => {
        
        const simulador = new Simulador(1024, 5, new FirstFit())
        
        simulador.registrar(1, 100, 1)
        
        simulador.registrar(2, 100, 2)

        simulador.avanzarTick()

        expect(simulador.getProcesos()[1].getCpuRestante()).toBe(2)


    })
})

describe("bloqueo por entrada y salida", () =>{
    test("bloquea, conserva memoria, no consume cpu y retorna al vencer el temporizador",() => {

        const simulador = new Simulador(1024, 5, new FirstFit())
        simulador.registrar(1, 100, 3, new EventoES(1, 2))

        const p1 = simulador.getProcesos()[0]

        simulador.avanzarTick()

        expect(p1.getEstado()).toBe(EstadodeProceso.Bloqueado)

        expect(p1.getCpuRestante()).toBe(2)

        expect(p1.getBloqueoRestante()).toBe(2)

        simulador.avanzarTick()
        expect(p1.getEstado()).toBe(EstadodeProceso.Bloqueado)

        expect(p1.getCpuRestante()).toBe(2)
        expect(p1.getBloqueoRestante()).toBe(1)

        expect(simulador.getMapadeMemoria()[0].getPidAsignado()).toBe(1)

        simulador.avanzarTick()

        expect(p1.getEstado()).toBe(EstadodeProceso.Ejecutando)
        expect(p1.getCpuRestante()).toBe(1)




    })

    test("mientras un proceso esta bloqueado otro usa la cpu", ()=> {
        const simulador = new Simulador(1024, 5, new FirstFit())

        simulador.registrar(1, 100, 3, new EventoES(1, 3))
        simulador.registrar(2, 100, 3)

        const p2 = simulador.getProcesos()[1]

        simulador.avanzarTick()
        expect(p2.getCpuRestante()).toBe(3)

        simulador.avanzarTick()

        expect(p2.getCpuRestante()).toBe(2)
    })


})

describe("metricas", () =>{
    test (" en el tick 0 las metricas son las del estado inicial", () => {
        const metricas = new Simulador(1024, 2, new FirstFit()).getMetricas()
        expect(metricas.getOcupacionMemoria()).toBe(0)

        expect(metricas.getUtilizacionCpu()).toBe(0)

        expect(metricas.getCambiosdeContexto()).toBe(0)

        expect(metricas.getMemoriaLibreTotal()).toBe(1024)
        expect(metricas.getMayorbloqueLibre()).toBe(1024)
        expect(metricas.getFragmentacionexterna()).toBe(0)


    })


    test("se recalculan al finalizar cada tick", () =>{
        const simulador = new Simulador(1000, 5, new FirstFit())
        simulador.registrar(1, 250, 5)

        simulador.avanzarTick()

        const metricas = simulador.getMetricas()
        expect(metricas.getOcupacionMemoria()).toBe(25)
        expect(metricas.getUtilizacionCpu()).toBe(100)
        expect(metricas.getMemoriaLibreTotal()).toBe(750)
    })


    test("un tick con la cpu libre baja la utilizacion de cpu", () =>{
        
        const simulador = new Simulador(1000, 5, new FirstFit())
        simulador.registrar(1, 250, 1)

        simulador.avanzarTick()
        simulador.avanzarTick()

        expect(simulador.getMetricas().getUtilizacionCpu()).toBe(50)
    })

    test("round robin p1  cpu 3 y p2  cpu 2 con quantum 2 un cambio de contexto" , () =>{
        
        const simulador = new Simulador(1024, 2, new FirstFit())
        
        simulador.registrar(1, 100, 3)
        
        simulador.registrar(2, 100, 2)

        simulador.avanzarTick()
        simulador.avanzarTick()
        simulador.avanzarTick()
        simulador.avanzarTick()
        simulador.avanzarTick()

        expect(simulador.getMetricas().getCambiosdeContexto()).toBe(1)
        
        expect(simulador.getMetricas().getUtilizacionCpu()).toBe(100)
    })


    test("un bloqueo por entrada y salida cuenta un cambio de contexto", () =>{

        const simulador = new Simulador(1024, 5, new FirstFit())
        simulador.registrar(1, 100, 3, new EventoES(1, 2))

        simulador.avanzarTick()

        expect(simulador.getMetricas().getCambiosdeContexto()).toBe(1)
    })


    test("con la memoria llena la ocupacion es de 100% y la fragmentacion de 0", () =>{


        const simulador = new Simulador(500, 5, new FirstFit())
        
        simulador.registrar(1, 500, 5)

        simulador.avanzarTick()

        expect(simulador.getMetricas().getOcupacionMemoria()).toBe(100)
        
        expect(simulador.getMetricas().getFragmentacionexterna()).toBe(0)
    })


})

describe("consulta del proceso en cpu y de los listos", () => {

    test("al inicio no hay proceso en cpu ni listos", () =>{

        const simulador = new Simulador(1024, 2, new FirstFit())

        expect(simulador.getProcesoEnCpu()).toBe(undefined)


        expect(simulador.getListos().length).toBe(0)
    })

    test("informa el proceso en cpu y los listos en orden de cola", () =>{

        const simulador = new Simulador(1024, 5, new FirstFit())

        simulador.registrar(1, 100, 3)
        simulador.registrar(2, 100, 3)
        simulador.registrar(3, 100, 3)

        simulador.avanzarTick()


        expect(simulador.getProcesoEnCpu()?.getPid()).toBe(1)


        expect(simulador.getListos().length).toBe(2)

        expect(simulador.getListos()[0].getPid()).toBe(2)


        expect(simulador.getListos()[1].getPid()).toBe(3)



    })

    test("tras el quantum el proceso expulsado va al final de los listos", () =>{

        const simulador = new Simulador(1024, 1, new FirstFit())

        simulador.registrar(1, 100, 3)

        simulador.registrar(2, 100, 3)

        simulador.avanzarTick()

        expect(simulador.getProcesoEnCpu()).toBe(undefined)

        expect(simulador.getListos()[0].getPid()).toBe(2)


        expect(simulador.getListos()[1].getPid()).toBe(1)
    })
})

describe("consulta de esperando, bloqueados y terminados", () =>{
    test("informa los proceso esperando memoria", () =>{

        const simulador = new Simulador(1000, 2, new FirstFit())

        simulador.registrar(1, 800, 5)
        simulador.registrar(2, 500, 5)


        simulador.avanzarTick()


        expect(simulador.getEsperandoMemoria().length).toBe(1)
        expect(simulador.getEsperandoMemoria()[0].getPid()).toBe(2)
    })

    test("informa los proceso bloquados", () =>{

    const simulador = new Simulador(1024, 5, new FirstFit())

    simulador.registrar(1, 100, 3, new EventoES(1,2))

    simulador.avanzarTick()

    expect(simulador.getBloqueados().length).toBe(1)

    expect(simulador.getBloqueados()[0].getPid()).toBe(1)
    
    expect(simulador.getListos().length).toBe(0)
    
    expect(simulador.getProcesoEnCpu()).toBe(undefined)

    

    })

})


