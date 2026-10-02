import {describe, test, expect} from "vitest"
import { Proceso } from "../src/Proceso" 
import { EstadodeProceso } from "../src/EstadodeProceso"
import type { IProcesoConsulta } from "../src/IProcesoConsulta"
import type { IProcesodeControl} from "../src/IProcesodecontrol"

describe("transiciones validas", () => {
    test("Un proceso Nuevo pasa a Listo al ser admitido", () =>{

        const p = new Proceso(1, 200, 5)

        expect(p.admitir()).toBe(true)
        expect(p.getEstado()).toBe(EstadodeProceso.Listo)

    })

    test("un proceso Nuevo pasa a Esperando Memoria si no hay lugar", ()  => {
        const p = new Proceso(2,500,8)

        expect(p.esperarMemoria()).toBe(true)
        expect(p.getEstado()).toBe(EstadodeProceso.Esperando_Memoria)

    })
    
    test("un proceso Esperando Memoria pasa a Listo al ser admitido", () => {

        const p = new Proceso(2,500, 8)
        p.esperarMemoria()

        expect(p.admitir()).toBe(true)
        expect(p.getEstado()).toBe(EstadodeProceso.Listo)

    })

    test("un proceso Listo pasa a Ejecutando al ser despachado", () =>{

        const p = new Proceso(1, 200, 6)
        p.admitir()

        expect(p.despachar()).toBe(true)
        expect(p.getEstado()).toBe(EstadodeProceso.Ejecutando)

    })

    test("un proceso Ejecutando vuelve a Listo al ser expulsado", () => {

        const p = new Proceso(1,200,5)

        p.admitir()
        p.despachar()

        expect(p.expulsar()).toBe(true)
        expect(p.getEstado()).toBe(EstadodeProceso.Listo)
    })

    test ("un proceso Ejecutando pasa a Terminado al terminar", ()=> {
        const p = new Proceso(2, 200, 5)
        p.admitir()
        p.despachar()
        
        expect(p.terminar()).toBe(true)
        expect(p.getEstado()).toBe(EstadodeProceso.Terminado)

    })
})