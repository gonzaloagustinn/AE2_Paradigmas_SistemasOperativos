import { test, describe, expect } from "vitest"
import { Simulador } from "../src/Simulador"
import { FirstFit } from "../src/FirstFit"
import { Informe } from "../src/Informe" 

describe("reporte de un tick", () => {
    test("al inicio informa el tick 0 y la cpu libre", () => {
        const reporte = new Informe(new Simulador(1024, 2, new FirstFit()))

        expect(reporte.describirTick()).toBe("Tick 0 | CPU: - | Listos: -")

    })

    test("informa el proceso que esta en cpu", () => {
       
        const simulador = new Simulador(1024, 2, new FirstFit())
        
        simulador.registrar(1, 100, 3)
        simulador.avanzarTick()
        
        const reporte = new Informe(simulador)
       
        expect(reporte.describirTick()).toBe("Tick 1 | CPU: P1 | Listos: -")
    })


    test("informa los procesos listos en orden",()=>{
    const simulador = new Simulador(1024, 2, new FirstFit())
    
    simulador.registrar(1, 100, 3)
    
    simulador.registrar(2, 100, 3)
    
    simulador.registrar(3, 100, 3)
    
    simulador.avanzarTick()
    
    const informe = new Informe(simulador)

    expect(informe.describirTick()).toBe("Tick 1 | CPU: P1 | Listos: P2,P3")


    })

})