import { test, describe, expect } from "vitest"
import { Simulador } from "../src/Simulador"
import { FirstFit } from "../src/FirstFit"
import { Informe } from "../src/Informe" 
import { EventoES } from "../src/EventoES"

describe("reporte de un tick", () => {
    test("al inicio informa el tick 0 y la cpu libre", () => {
        const informe = new Informe(new Simulador(1024, 2, new FirstFit()))

        expect(informe.describirTick()).toBe("Tick 0 | CPU: - | Listos: - | Bloqueados: - | Espera memoria: -")


    })

    test("informa el proceso que esta en cpu", () => {
       
        const simulador = new Simulador(1024, 2, new FirstFit())
        
        simulador.registrar(1, 100, 3)
        simulador.avanzarTick()
        
        const informe = new Informe(simulador)
       
        expect(informe.describirTick()).toBe("Tick 1 | CPU: P1 | Listos: - | Bloqueados: - | Espera memoria: -")
    })


    test("informa los procesos listos en orden",()=>{
    const simulador = new Simulador(1024, 2, new FirstFit())
    
    simulador.registrar(1, 100, 3)
    
    simulador.registrar(2, 100, 3)
    
    simulador.registrar(3, 100, 3)
    
    simulador.avanzarTick()
    
    const informe = new Informe(simulador)

    expect(informe.describirTick()).toBe("Tick 1 | CPU: P1 | Listos: P2,P3 | Bloqueados: - | Espera memoria: -")

    })

    
    test("informa el proceso bloqueado por entrada y salida", () => {
        
        const simulador = new Simulador(1024, 2, new FirstFit())
        
        simulador.registrar(1, 100, 3, new EventoES(1, 2))
        simulador.avanzarTick()
        
        const informe = new Informe(simulador)
        
        expect(informe.describirTick()).toBe("Tick 1 | CPU: - | Listos: - | Bloqueados: P1 | Espera memoria: -")
    })

    test("informa el proceso que espera memoria", () => {
        const simulador = new Simulador(1024, 2, new FirstFit())
        
        simulador.registrar(1, 1000, 3)
        simulador.registrar(2, 100, 3)
        simulador.avanzarTick()
        
        const informe = new Informe(simulador)
        
        expect(informe.describirTick()).toBe("Tick 1 | CPU: P1 | Listos: - | Bloqueados: - | Espera memoria: P2")
    })

})