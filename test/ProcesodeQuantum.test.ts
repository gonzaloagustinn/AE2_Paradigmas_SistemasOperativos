import { describe, test, expect } from "vitest"

import { Proceso } from "../src/Proceso"

describe("quantum al despachar", () => {
    test("al despachar se reinicia el quantum consumido", () =>{
        test("al despachar se reinicia el quantum consumido", () => {

            const p = new Proceso(1, 100, 5)

            p.admitir()
            p.despachar()
            p.ejecutarTick()
            p.ejecutarTick()
            p.expulsar()


            p.despachar()

            expect(p.getQuantumConsumido()).toBe(0)
        })

        test("un despacho rechazado no toca el quantum consumido", () =>{

            const p = new Proceso (1, 100, 5)
            p.admitir()
            p.despachar()
            p.ejecutarTick()


            expect(p.despachar()).toBe(false)
            expect(p.getQuantumConsumido()).toBe(1)
        })
    })
})