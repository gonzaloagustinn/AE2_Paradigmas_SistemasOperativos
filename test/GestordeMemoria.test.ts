import { describe, test, expect } from "vitest"
import { GestordeMemoria } from "../src/GestordeMemoria"
import type { IConsultaMemoria } from "../src/IConsultaMemoria"
import { FirstFit } from "../src/FirstFit"


describe("estado inicial", () => {

    test("guarda la memoria total", () => {
        const gestor = new GestordeMemoria(1000, new FirstFit())

        expect(gestor.getMemoriaTotal()).toBe(1000)
    })

    test("al inicio hay un unico bloque", () => {

        const gestor = new GestordeMemoria(1000, new FirstFit())

        expect(gestor.getBloques().length).toBe(1)

    })

    test("el bloque inicial esta libre, tiene que empezar en 0 y ocupa toda la memoria", () => {

        const bloque = new GestordeMemoria(1000, new FirstFit()).getBloques()[0]

        expect(bloque.estaLibre()).toBe(true)
        expect(bloque.getInicio()).toBe(0)
        expect(bloque.getTamano()).toBe(1000)
    })

    test("se puede usar a traves de interface consultar memoria", () => {

        const consulta: IConsultaMemoria = new GestordeMemoria(1000, new FirstFit())

        expect(consulta.getMemoriaTotal()).toBe(1000)

    })
})


describe("validez memoria", () => {

    test("una memoria total positiva y entera es valida", () => {

        expect(new GestordeMemoria(1000, new FirstFit()).esValido()).toBe(true)

    })

    test("una memoria total 0 no es valida", () => {

        expect(new GestordeMemoria(0, new FirstFit()).esValido()).toBe(false)

    })

    test("una memoria total negativa no es valida", () => {

        expect(new GestordeMemoria(-10, new FirstFit()).esValido()).toBe(false)

    })

    test("una memoria total decimal no es valida", () => {

        expect(new GestordeMemoria(10.5, new FirstFit()).esValido()).toBe(false)

    })
})


describe("asignar", () => {

    test("asignar en memoria vacía divide el bloque en ocupado y libre", () => {

        const gestor = new GestordeMemoria(1000, new FirstFit())

        expect(gestor.asignar(1, 300)).toBe(true)

        const bloques = gestor.getBloques()

        expect(bloques.length).toBe(2)
        expect(bloques[0].getPidAsignado()).toBe(1)
        expect(bloques[0].getTamano()).toBe(300)
        expect(bloques[1].estaLibre()).toBe(true)
        expect(bloques[1].getInicio()).toBe(300)
        expect(bloques[1].getTamano()).toBe(700)

    })

    test("un ajuste exacto no crea bloque libre de tamaño cero", () => {

        const gestor = new GestordeMemoria(1000, new FirstFit())

        expect(gestor.asignar(1, 1000)).toBe(true)
        expect(gestor.getBloques().length).toBe(1)

    })

    test("si no hay bloque suficiente devuelve false y no cambia los bloques", () => {

        const gestor = new GestordeMemoria(1000, new FirstFit())

        expect(gestor.asignar(1, 1500)).toBe(false)
        expect(gestor.getBloques().length).toBe(1)
        expect(gestor.getBloques()[0].estaLibre()).toBe(true)

    })
})