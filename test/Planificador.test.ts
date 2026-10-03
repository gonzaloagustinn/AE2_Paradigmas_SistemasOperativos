import { describe, test, expect } from "vitest"
import { Planificador } from "../src/Planificador"
import { Proceso } from "../src/Proceso"
import type { IConsultadePlanificador } from "../src/IConsultadePlanificador"


function procesoListo(pid: number) : Proceso {

    const p = new Proceso (pid, 100, 5)

    p.admitir()
    return p
}


describe ("estado inicial", () => {
    test ("guarda el quantum, sin cola de listos ni proceso de Cpu", () => {

        const planificador = new Planificador(2)

        expect(planificador.getQuantum()).toBe(2)
        expect(planificador.getColaListos().length).toBe(0)
        expect(planificador.getEjecutando()).toBe(undefined)

    })

    test ("un quantum positivo y enetero es valido", () => {
        expect(new Planificador(2).esValido()).toBe(true)

    })

    test("un quantum 0, negativo o decimal no es valido", () =>{
        const consulta: IConsultadePlanificador = new Planificador(3)

        expect(consulta.getQuantum()).toBe(3)

    })


})


describe("cola FIFO de listos", () => {
    test ("encola procesos Listos respetando el orden de llegada", () => {

        const planificador = new Planificador(2)

        expect(planificador.encolar(new Proceso(1, 100, 5))).toBe(false)

        expect(planificador.getColaListos().length).toBe(0)

    })

    test("rechaza un proceso que ya esta en la cola", () => {
        const planificador = new Planificador(2)
        const p = procesoListo(1)
        planificador.encolar(p)


        expect(planificador.encolar(p)).toBe(false)
        expect(planificador.getColaListos().length).toBe(1)

    })
})