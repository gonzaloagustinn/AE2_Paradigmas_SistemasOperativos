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

describe("liberar", () => {

    test("liberar un proceso deja su bloque libre", () => {

        const gestor = new GestordeMemoria(1000, new FirstFit())

        gestor.asignar(1, 300)

        expect(gestor.liberar(1)).toBe(true)

        const bloques = gestor.getBloques()

        expect(bloques.length).toBe(1)
        expect(bloques[0].estaLibre()).toBe(true)
        expect(bloques[0].getInicio()).toBe(0)
        expect(bloques[0].getTamano()).toBe(1000)

    })

    test("liberar un proceso que no existe devuelve false", () => {

        const gestor = new GestordeMemoria(1000, new FirstFit())

        expect(gestor.liberar(99)).toBe(false)

        expect(gestor.getBloques().length).toBe(1)
        expect(gestor.getBloques()[0].estaLibre()).toBe(true)

    })

    test("liberar un bloque permite volver a usar esa memoria", () => {

        const gestor = new GestordeMemoria(1000, new FirstFit())

        gestor.asignar(1, 300)
        gestor.liberar(1)

        expect(gestor.asignar(2, 500)).toBe(true)

        expect(gestor.getBloques()[0].getPidAsignado()).toBe(2)
        expect(gestor.getBloques()[0].getTamano()).toBe(500)

    })

    test("liberar dos procesos contiguos fusiona los bloques libres", () => {

        const gestor = new GestordeMemoria(1000, new FirstFit())

        gestor.asignar(1, 300)
        gestor.asignar(2, 300)

        gestor.liberar(1)
        gestor.liberar(2)

        const bloques = gestor.getBloques()

        expect(bloques.length).toBe(1)
        expect(bloques[0].estaLibre()).toBe(true)
        expect(bloques[0].getInicio()).toBe(0)
        expect(bloques[0].getTamano()).toBe(1000)

    })
})

describe("coalescencia", () => {

    test("liberar une con el espacio libre de la izquierda", () => {
        const gestor = new GestordeMemoria(1000, new FirstFit)
        gestor.asignar(1, 200)
        gestor.asignar(2, 100)
        gestor.asignar(3, 100)
        gestor.liberar(1)
        gestor.liberar(2)

        const bloques = gestor.getBloques()
        expect(bloques.length).toBe(3)
        expect(bloques[0].estaLibre()).toBe(true)
        expect(bloques[0].getInicio()).toBe(0)
        expect(bloques[0].getTamano()).toBe(300)
        expect(bloques[1].getPidAsignado()).toBe(3)


    })

    test("liberar une con el espacio libre de la derecha", () =>{
        const gestor = new GestordeMemoria(1000, new FirstFit)

        gestor.asignar(1, 200)
        gestor.asignar(2, 100)
        gestor.liberar(2)

        const bloques = gestor.getBloques()
        expect(bloques.length).toBe(2)
        expect(bloques[0].getPidAsignado()).toBe(1)
        expect(bloques[1].estaLibre()).toBe(true)
        expect(bloques[1].getInicio()).toBe(200)
        expect(bloques[1].getTamano()).toBe(800)



    })

    test("liberar une une con los espacios libres de ambos lados", () =>{
        
        const gestor = new GestordeMemoria(1000, new FirstFit())
        gestor.asignar(1, 100)
        gestor.asignar(2, 100)
        gestor.asignar(3, 100)

        gestor.liberar(1)
        gestor.liberar(3)
        gestor.liberar(2)

        const bloques = gestor.getBloques()
        expect(bloques.length).toBe(1)
        expect(bloques[0].getInicio()).toBe(0)
        expect(bloques[0].getTamano()).toBe(1000)

    })

    test("liberar un bloque entre ocupados no se una con nadie", () => {
        const gestor = new GestordeMemoria(1000, new FirstFit())

        gestor.asignar(1, 100)
        gestor.asignar(2, 200)
        gestor.asignar(3, 100)
        gestor.liberar(2)

        const bloques = gestor.getBloques()
        expect(bloques.length).toBe(4)
        expect(bloques[1].estaLibre()).toBe(true)
        expect(bloques[1].getTamano()).toBe(200)
    })
})


describe("cantidades de memoria", () => {
    test("con la memoria vacia todo esta libre y el mayor bloque es el total", () => {
        const gestor = new GestordeMemoria(1000, new FirstFit())

        expect(gestor.getMemoriaocupada()).toBe(0)

        expect(gestor.getMemorialibretotal()).toBe(1000)

        expect(gestor.getMayorbloquelibres()).toBe(1000)
    })

    test("con la memoria llena no hay libre y el mayor bloque libre es igual a 0", () => {
        const gestor = new GestordeMemoria(1000, new FirstFit())
        gestor.asignar(1, 1000)

        expect(gestor.getMemoriaocupada()).toBe(1000)

        expect(gestor.getMemorialibretotal()).toBe(0)

        expect(gestor.getMayorbloquelibres()).toBe(0)
    
    })

        test("huecos no contiguos de 100 y 300, libre total 400 y mayor hueco 300", () => {
        
            const gestor = new GestordeMemoria(800, new FirstFit())
        gestor.asignar(1, 100)

        gestor.asignar(2, 100)


        gestor.asignar(3, 300)
        gestor.asignar(4, 300)


        gestor.liberar(1)

        gestor.liberar(3)

        expect(gestor.getMemoriaocupada()).toBe(400)

        expect(gestor.getMemorialibretotal()).toBe(400)

        
        expect(gestor.getMayorbloquelibres()).toBe(300)


    })



})


describe("proteccion del estaod interno", () => {
    
    test("devuelve una copia, no la lista interna",() => {

        const gestor = new GestordeMemoria(1000, new FirstFit())

        const primera = gestor.getBloques()
        const segunda = gestor.getBloques()

        expect(primera === segunda).toBe(false)
        expect(primera.length).toBe(segunda.length)

    })
})