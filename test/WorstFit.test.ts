import { describe, test, expect } from "vitest"
import { WorstFit } from "../src/WorstFit"
import { BloquedeMemoria } from "../src/BloquedeMemoria"
import type { IPoliticadeAsignacion } from "../src/IPoliticadeAsignacion"


function memoriadePrueba(): BloquedeMemoria[] {

    return [ 
        new BloquedeMemoria(0, 100),
        new BloquedeMemoria(100, 50, 1),
        new BloquedeMemoria(150, 200),
        new BloquedeMemoria(350, 60)
    ]
}

describe("WorstFit", () => {
    test("elige el bloque libre mas grande", () => {
        const elegido = new WorstFit().seleccionar(memoriadePrueba(), 55)

        expect(elegido?.getInicio()).toBe(150)

    })

    test ("si hay mas bloques con el mismo tamaño, elige el de menor direccion", () => {

        const bloques = [new BloquedeMemoria(0, 100), new BloquedeMemoria(100, 50, 1), new BloquedeMemoria(150, 100)]

        const elegido = new WorstFit().seleccionar(bloques, 80)

        expect(elegido?.getInicio()).toBe(0)

    })

    test("ignora los bloques ocupados aunque sean los mas grandes", () => {

        const bloques = [new BloquedeMemoria(0, 500, 1), new BloquedeMemoria(500, 100)]

        const elegido = new WorstFit().seleccionar(bloques, 50)

        expect(elegido?.getInicio()).toBe(500)

    })

    test("si ninguno alcanza, devuelve indefinido", () => {

        expect(new WorstFit().seleccionar(memoriadePrueba(), 500)).toBe(undefined)

    })

    test("se puede usar a traves de IPoliticadeAsignacion", () =>{

        const politica: IPoliticadeAsignacion = new WorstFit()

        expect(politica.seleccionar(memoriadePrueba(), 55)?.getInicio()).toBe(150)
        
    })
})