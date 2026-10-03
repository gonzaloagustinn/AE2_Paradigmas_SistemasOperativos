import { describe, test, expect } from "vitest"
import { GestordeMemoria } from "../src/GestordeMemoria"
import type { IConsultaMemoria } from "../src/IConsultaMemoria"


describe("estado inicial", () => {

    test("guarda la memoria total", () => {
        const gestor = new GestordeMemoria(1000)

        expect(gestor.getMemoriaTotal()).toBe(1000)
    })

    test("al inicio hay un unico bloque", () => {

        const gestor = new GestordeMemoria(1000)

        expect(gestor.getBloques().length).toBe(1)

    })

    test ("el bloque inicial esta libre, tiene que empezar en 0 y ocupa toda la memoria", () => {

        const bloque = new GestordeMemoria(1000).getBloques()[0]

        expect(bloque.estaLibre()).toBe(true)
        expect(bloque.getInicio()).toBe(0)
        expect(bloque.getTamano()).toBe(1000)
    })

    test (" se puede usar a traves de interface consultar memoria", () => {

        const consulta: IConsultaMemoria = new GestordeMemoria(1000)

        expect(consulta.getMemoriaTotal()).toBe(1000)

    })
})

describe("validez memoria", () => {
    
    test("una memoria total positiva y entera es valida", () => {
       
       
        expect(new GestordeMemoria(1000).esValido()).toBe(true)


    });


    test("una memoria total 0 no es valida", () => {
        
        
        expect(new GestordeMemoria(0).esValido()).toBe(false)


    });

    test("Una memoria total negativa no es valida", () => {


        expect(new GestordeMemoria(-10).esValido()).toBe(false);
    
    });


    
    test("Una memoria total decimal no es valida", () => {
    
        expect(new GestordeMemoria(10.5).esValido()).toBe(false);
    
    
    
    });


});