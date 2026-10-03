import { describe, test, expect } from "vitest"
import { BloquedeMemoria } from "../src/BloquedeMemoria"
import { FirstFit } from "../src/FirstFit"
import type {IPoliticadeAsignacion} from "../src/IPoliticadeAsignacion"

function memoriadePrueba(): BloquedeMemoria[] {
    return [

        new BloquedeMemoria(0, 100),
        new BloquedeMemoria(100, 50, 1),
        new BloquedeMemoria(150, 200),
        new BloquedeMemoria(350, 100),
    ]
}

describe("elección del bloque", () =>{
    test("elige el primer bloque libre donde entra el proceso", () =>{
        const elegido = new FirstFit().seleccionar(memoriadePrueba(), 80)

        expect(elegido?.getInicio()).toBe(0)
    })

    test("saltea los bloques que son muy chicos", () =>{
        const elegido = new FirstFit().seleccionar(memoriadePrueba(), 150)

        expect(elegido?.getInicio()).toBe(150)
    })

    test("un bloque del tamaño exacto es suficiente", () => {

        const elegido = new FirstFit().seleccionar(memoriadePrueba(), 100)

        expect(elegido?.getInicio()).toBe(0)

    })

    test("ignora los bloques que estan ocupados aunque tengan espacio", ()=>{
        const bloques = [new BloquedeMemoria(0, 500, 1), new BloquedeMemoria(500, 100)]

        const elegido = new FirstFit().seleccionar(bloques, 100)

        expect(elegido?.getInicio()).toBe(500)

    })

    test("si ningun bloque alcanza no elige ninguno", () => {
        const elegido = new FirstFit().seleccionar(memoriadePrueba(), 300)

        expect(elegido).toBe(undefined)
    })


    test("si no hay ningun bloque no elije ninguno", () =>{

        const elegido = new FirstFit().seleccionar([], 10)

        expect(elegido).toBe(undefined)
    })

    test("se puede usar a traves de IPoliticadeAsignacion", () => {

        const politica: IPoliticadeAsignacion = new FirstFit()


        expect(politica.seleccionar(memoriadePrueba(), 80 )?.getInicio()).toBe(0)

    })

})