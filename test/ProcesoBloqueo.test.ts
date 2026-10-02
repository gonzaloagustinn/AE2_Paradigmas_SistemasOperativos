import { describe, test, expect } from "vitest"
import {Proceso} from "../src/Proceso"
import { EventoES } from "../src/EventoES"
import { EstadodeProceso } from "../src/EstadodeProceso"

describe("evento E/S", () => {
    test("un proceso con un evento valido es valido", () => {
        const p = new Proceso(1, 200, 5, new EventoES(2, 3))

        expect(p.esValido()).toBe(true)
    })

    test("un proceso con un evento invalido no es valido", () => {

        const p =new Proceso(1, 200, 5, new EventoES(0, 3))

        expect(p.esValido()).toBe(false)

    })
})

describe("bloqueo por entrada/salida", () => {
    test("no se bloquea antes de consumir los ticks del evento", () => {

        const p = new Proceso(1, 200, 5, new EventoES(2, 3))

        p.admitir()
        p.despachar()
        p.ejecutarTick()

        expect(p.bloquear()).toBe(false)
        expect(p.getEstado()).toBe(EstadodeProceso.Ejecutando)
    })

    test("se bloquea al consumir los ticks del evento", () => {
        const p = new Proceso(1, 200, 5, new EventoES(2, 3))

        p.admitir()
        p.despachar()
        p.ejecutarTick()
        p.ejecutarTick()

        expect(p.bloquear()).toBe(true)
        expect(p.getEstado()).toBe(EstadodeProceso.Bloqueado)
    })

    test("un proceso Bloqueado no consume Cpu", ()=>{

        const p=new Proceso(1, 200, 5, new EventoES(2,3))

        p.admitir()
        p.despachar()
        p.ejecutarTick()
        p.ejecutarTick()
        p.bloquear()

        expect(p.ejecutarTick()).toBe(false)
        expect(p.getCpuRestante()).toBe(3)

    })

    test("un proceso que termino no se bloquea aunque se dispare el evento", () => {
        const p = new Proceso (1, 200, 2, new EventoES (2, 3))

        p.admitir()
        p.despachar()
        p.ejecutarTick()
        p.ejecutarTick()

        expect(p.getBloqueoRestante()).toBe(0)
        expect(p.getEstado()).toBe(EstadodeProceso.Ejecutando)

    })

    test("un proceso que no esta ejecutando no se bloquea", () =>{
        const p = new Proceso(1, 200, 5, new EventoES(2, 3))
        p.admitir()

        expect(p.bloquear()).toBe(false)
        expect(p.getEstado()).toBe(EstadodeProceso.Listo)
    })

    describe("retorno del bloqueo", () => {
        test("el temporizador baja de a uno y el proceso sigue Bloqueado hasta llegar a cero", () => {
            
            const p = new Proceso(1, 200, 5, new EventoES(2,3 ))

            p.admitir()
            p.despachar()
            p.ejecutarTick()
            p.ejecutarTick()
            p.bloquear()

            expect(p.avanzarBloqueo()).toBe(false)
            expect(p.getBloqueoRestante()).toBe(2)
            expect(p.avanzarBloqueo()).toBe(false)
            expect(p.getBloqueoRestante()).toBe(1)
            expect(p.getEstado()).toBe(EstadodeProceso.Bloqueado)

        })
    })

    test("al llegar el temporizador a cero el proceso vuelve a Listo", () => {
        const p = new Proceso(1, 200, 5, new EventoES(2, 3))

        p.admitir()
        p.despachar()
        p.ejecutarTick()
        p.ejecutarTick()
        p.bloquear()
        p.avanzarBloqueo()
        p.avanzarBloqueo()

        expect(p.avanzarBloqueo()).toBe(true)
        expect(p.getBloqueoRestante()).toBe(0)
        expect(p.getEstado()).toBe(EstadodeProceso.Listo)
    })

    test(" el evento se dispara una sola vez", () =>{
        const p = new Proceso(1, 200, 5, new EventoES(2, 1))

        p.admitir()
        p.despachar()
        p.ejecutarTick()
        p.ejecutarTick()
        p.bloquear()
        p.avanzarBloqueo()
        p.despachar()
        p.ejecutarTick()

        expect(p.bloquear()).toBe(false)
        expect(p.getEstado()).toBe(EstadodeProceso.Ejecutando)

    })

    
})
