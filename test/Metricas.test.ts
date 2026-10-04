import { describe, test, expect } from "vitest"
import { Metricas } from "../src/Metricas"
import type { IMetricas } from "../src/IMetricas"

function conMemoria(total: number, libre: number, mayorLibre: number): Metricas {
    
    return new Metricas(total, libre, mayorLibre, 0, 0, 0)


}

describe("metricas memoria", () => {

    test("ocupacion de memoria = 100 x ocupada / total", () => {
        

        expect(conMemoria(1000, 750, 750).getOcupacionMemoria()).toBe(25)
        
        
        expect(conMemoria(1000, 1000, 1000).getOcupacionMemoria()).toBe(0)
        
        expect(conMemoria(1000, 0, 0).getOcupacionMemoria()).toBe(100)
    
    
    })

    test("Memoria libre total y mayor bloque libre se informan tal cual", () => {
        const metricas = conMemoria(800, 400, 300)


         expect(metricas.getMemoriaLibreTotal()).toBe(400)

        expect(metricas.getMayorbloqueLibre()).toBe(300)
    })


    test("huecos de 100 y 300kb fragmentación externa del  25%", () => {
        
        expect(conMemoria(800, 400, 300).getFragmentacionexterna()).toBe(25)
    })

     test("con un unico hueco no hay fragmentacion", () => {
        expect(conMemoria(1000, 600, 600).getFragmentacionexterna()).toBe(0)
    })


     test("con la memoria llena la fragmentación es de 0%", () => {
       
        expect(conMemoria(1000, 0, 0).getFragmentacionexterna()).toBe(0)
    
    
    })


      test("se puede usar a traves de la interface de metricas", () => {
        const consulta: IMetricas = conMemoria(800, 400, 300)

        expect(consulta.getFragmentacionexterna()).toBe(25)
    })


})

describe("cpu y cambios de contrexto", ()=>{
    test("utilizacion de cpu, 100 x ticks con cpu ocupada / ticks transcurridos", ()=>{
    
    expect(new Metricas(1000, 1000, 1000, 3, 4, 0).getUtilizacionCpu()).toBe(75)
    
    expect(new Metricas(1000, 1000, 1000, 4, 4, 0).getUtilizacionCpu()).toBe(100)
    
    expect(new Metricas(1000, 1000, 1000, 0, 4, 0).getUtilizacionCpu()).toBe(0)



    })

    test("en el tick 0 la utilizacion de la cpu es 0%", () =>{
        expect(new Metricas(1000, 1000, 1000, 0, 0, 0).getUtilizacionCpu()).toBe(0)


    })

    test("los cambios de contexto se informan tal cual es", () =>{

    
    expect(new Metricas(1000, 1000, 1000, 1, 2, 3).getCambiosdeContexto()).toBe(3)


    })
})