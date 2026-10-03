import {describe, test, expect} from "vitest"
import { Proceso } from "../src/Proceso" 
import { EstadodeProceso } from "../src/EstadodeProceso"
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

    describe("transiciones invalidas", () => {

        test("Un proceso Nuevo no puede ser Despachado", () =>{

            const p = new Proceso(1, 200, 5)

            expect(p.despachar()).toBe(false)
            expect(p.getEstado()).toBe(EstadodeProceso.Nuevo)

        })

        test("un proceso Listo no puede ser admitido otra vez", () => {

            const p = new Proceso(2,500, 8)
            p.admitir()

            expect(p.admitir()).toBe(false)
            expect(p.getEstado()).toBe(EstadodeProceso.Listo)

        })

        test("un proceso Listo no puede terminar sin haber Ejecutado", () => {

            const p = new Proceso(2,500, 8)
            p.admitir()

            expect(p.terminar()).toBe(false)
            expect(p.getEstado()).toBe(EstadodeProceso.Listo)
            
        })

        test("un proceso Ejecutnado no puede esperar memoria", () => {

            const p = new Proceso(2,500, 8)
            p.admitir()
            p.despachar()

            expect(p.esperarMemoria()).toBe(false)
            expect(p.getEstado()).toBe(EstadodeProceso.Ejecutando)

        })

        describe("un proceso Terminado no vuelve", () => {

            test("Un proceso Terminado no puede ser admitido", () => {
                const p = new Proceso(1, 200, 5);
                p.admitir();
                p.despachar();
                p.terminar();

                expect(p.admitir()).toBe(false);
                expect(p.getEstado()).toBe(EstadodeProceso.Terminado);

            })

            test("Un proceso TERMINADO no puede esperar memoria", () => {
                const p = new Proceso(1, 200, 5);
                p.admitir();
                p.despachar();
                p.terminar();

                expect(p.esperarMemoria()).toBe(false);
                expect(p.getEstado()).toBe(EstadodeProceso.Terminado);
            });

            test("un proceso Terminado no puede ser despachado", ()=> {
                const p = new Proceso (1,200,5)

                p.admitir()
                p.despachar()
                p.terminar()

                expect(p.despachar()).toBe(false)
                expect(p.getEstado()).toBe(EstadodeProceso.Terminado)

            })

            test("un proceso Terminado no puede ser expulsado", () => {
                
                const p = new Proceso (1,200, 5)

                p.admitir()
                p.despachar()
                p.terminar()

                expect(p.expulsar()).toBe(false)
                expect(p.getEstado()).toBe(EstadodeProceso.Terminado)

            })

            test("un proceso terminado no puede terminar de nuevo", ()=>{
                const p = new Proceso (1, 200, 5)

                p.admitir()
                p.despachar()
                p.terminar()

                expect(p.terminar()).toBe(false)
                expect(p.getEstado()).toBe(EstadodeProceso.Terminado)

            })

        })

        describe("mirada de control", () => {
            test("un proceso se puede manejar a traves de IProcesodecontrol", ()=>{

                const p = new Proceso   (1,200,5)
                const control: IProcesodeControl = p

                expect(control.admitir()).toBe(true)
                expect(p.getEstado()).toBe(EstadodeProceso.Listo)
            })
        })

    })

})