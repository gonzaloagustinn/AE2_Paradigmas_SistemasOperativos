import { describe, test, expect } from "vitest"
import { BloquedeMemoria } from "../src/BloquedeMemoria"

describe("Bloque de memoria libres", () =>{
    test("guarda su inicio y tamaño", () => {
        const bloque = new BloquedeMemoria(100, 50)

        expect(bloque.getInicio()).toBe(100)
        expect(bloque.getTamano()).toBe(50)

    })

    test("un bloque sin proceso asignado esta libre", () =>{
        const bloque = new BloquedeMemoria(0, 1024)

        expect(bloque.estaLibre()).toBe(true)
        expect(bloque.getPidAsignado()).toBe(undefined)
    })
})

describe("bloque de memoria ocupado", () => {
    test("guarda el pid del proceso asignado", () => {
        const bloque = new BloquedeMemoria(0, 200, 7)

        expect(bloque.getPidAsignado()).toBe(7)
    })

    test("un bloque con proceso asignado no esta libre", () => {
        const bloque = new BloquedeMemoria(0, 200, 7)

        expect(bloque.estaLibre()).toBe(false)
    })
})