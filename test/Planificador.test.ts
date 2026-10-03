import { describe, test, expect } from "vitest"
import { Planificador } from "../src/Planificador"
import { Proceso } from "../src/Proceso"
import type { IConsultadePlanificador } from "../src/IConsultadePlanificador"
import { EstadodeProceso } from "../src/EstadodeProceso"

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

        test("rechaza un proceso que no esta Listo", () => {
        const planificador = new Planificador(2)

        expect(planificador.encolar(new Proceso(1, 100, 5))).toBe(false)
        expect(planificador.getColaListos().length).toBe(0)
    })
})

describe(" despachar", () => {
    test("despacha el primero de la cola y lo deja ejecutando", () => {

        const planificador = new Planificador(2)
        planificador.encolar(procesoListo(1))

        planificador.encolar(procesoListo(2))
        planificador.despachar()

        expect(planificador.despachar()).toBe(false)
        expect(planificador.getEjecutando()?.getPid()).toBe(1)

    })

    test("un proceso de Cpu no puede cencolarse de nuevo", () => {
        const planificador = new Planificador(2)
        const p = procesoListo(1)
        planificador.encolar(p)
        planificador.despachar()

        expect(planificador.encolar(p)).toBe(false)
    })

    test("sin procesos listos no despacha", () => {
        expect(new Planificador(2).despachar()).toBe(false)
    })

    test("con la Cpu ocupada no despacha a otro", () => {
        const planificador = new Planificador(2)
        planificador.encolar(procesoListo(1))
        planificador.encolar(procesoListo(2))
        planificador.despachar()

        expect(planificador.despachar()).toBe(false)
        expect(planificador.getEjecutando()?.getPid()).toBe(1)
    })
})


function procesoconCpu(pid:number, cpu: number): Proceso {

    const p = new Proceso(pid, 100, cpu)

    p.admitir()
    
    return p
}

describe("ejecutar un tick", () => {
    test("sin proceso en Cpu no se ejecuta nada", () => {

        expect(new Planificador(2). ejecutarTick()).toBe(undefined)
    })

    test("consume una unidad de cpu del proceso en ejecucion", () => {

        const planificador = new Planificador(5)
        planificador.encolar(procesoconCpu(1, 3))
        planificador.despachar()

        const corrio = planificador.ejecutarTick()

        expect(corrio?.getPid()).toBe(1)
        expect(corrio?.getCpuRestante()).toBe(2)
        expect(corrio?.getQuantumConsumido()).toBe(1)
    })
})

describe("finalizacion del proceso al agotar cpu y liberar"), () => {
    test("al llegar la Cpu a cero el proceso termina y libera la Cpu", () => {
        const planificador = new Planificador(5)
        planificador.encolar(procesoconCpu(1, 1))
        planificador.despachar()

        const corrio = planificador.ejecutarTick()

        expect(corrio?.getEstado()).toBe(EstadodeProceso.Terminado)

        expect(planificador.getEjecutando()).toBe(undefined)
        expect(planificador.getColaListos().length).toBe(0)
        })
        
    test("otro proceso no se despacha en el mismo tick de la finalizacion", () => {

        const planificador = new Planificador (5)
        planificador.encolar(procesoconCpu(1, 1))

        planificador.encolar(procesoconCpu(2,2))
        planificador.despachar()

        expect(planificador.getEjecutando()).toBe(undefined)
    expect(planificador.getColaListos()[0].getEstado()).toBe(EstadodeProceso.Listo)

    
        
        
    })
    
    
    
    

}