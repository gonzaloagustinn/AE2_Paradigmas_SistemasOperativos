import { describe, test, expect } from "vitest"
import { BestFit } from "../src/BestFit"
import { BloquedeMemoria } from "../src/BloquedeMemoria"
import type { IPoliticadeAsignacion } from "../src/IPoliticadeAsignacion"

function memoriadePrueba(): BloquedeMemoria[] {

    return[
        new BloquedeMemoria(0, 100),
        new BloquedeMemoria(100, 50, 1),
        new BloquedeMemoria(150, 200),
        new BloquedeMemoria(350, 60)
    ]
}

describe("BestFit", () => {
    test("elige el bloque libre mas chico que alcanza", () => {
        const elegido = new BestFit().seleccionar(memoriadePrueba(), 55)

        expect(elegido?.getInicio()).toBe(350)
    })
})

describe("elección del bloque", () =>{
    test("elige el bloque mas chico donde entra el proceso", () =>{
        const elegido = new BestFit().seleccionar(memoriadePrueba(), 55)

        expect(elegido?.getInicio()).toBe(350)
    })

    test("si hay mas bloques con el mismo tamaño, elige el de menor direccion", () =>{
        const bloques  = [new BloquedeMemoria(0, 100), new BloquedeMemoria(100, 50, 1), new BloquedeMemoria(150, 100)]

        const elegido = new BestFit().seleccionar(bloques, 80)

        expect(elegido?.getInicio()).toBe(0)
    })

    test("ignora a los bloques ocupados aunque sean los mas ajustados", () => {

        const elegido = new BestFit().seleccionar(memoriadePrueba(), 50)

        expect(elegido?.getInicio()).toBe(350)

    })

    test("si ninguno alcanza, devuelve indefinido", ()=>{

        expect(new BestFit().seleccionar(memoriadePrueba(), 500)).toBe(undefined)

    })

    test("se puede usar a traves de IPoliticadeAsignacion", () => {
        const politica: IPoliticadeAsignacion = new BestFit()

        expect(politica.seleccionar(memoriadePrueba(), 55)?.getInicio()).toBe(350)
    })


    test("si no hay ningun bloque no elije ninguno", () =>{

        const elegido = new BestFit().seleccionar([], 10)

        expect(elegido).toBe(undefined)
    })

    test("se puede usar a traves de IPoliticadeAsignacion", () => {

        const politica: IPoliticadeAsignacion = new BestFit()


        expect(politica.seleccionar(memoriadePrueba(), 80 )?.getInicio()).toBe(0)

    })

})