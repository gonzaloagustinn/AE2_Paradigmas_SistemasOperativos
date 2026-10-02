import { describe, test, expect } from "vitest"

import { Proceso } from "../src/Proceso"

describe("ejecutar un tick", () => {
    test("un proceso Ejecutando consume un tick de Cpu y de quantum", () => {
        const p = new Proceso(1,200,5)
        p.admitir()
        p.despachar()

        expect(p.ejecutarTick()).toBe(true)
        expect(p.getCpuRestante()).toBe(4)
        expect(p.getQuantumConsumido()).toBe(1)

    })

    test("dos ticks consumen dos de cpu y dos de quantum", () => {
        const p = new Proceso(1, 200, 5)

        p.admitir()
        p.despachar()

        p.ejecutarTick()
        p.ejecutarTick()

        expect(p.getCpuRestante()).toBe(3)
        expect(p.getQuantumConsumido()).toBe(2)

    })

    test("ejecutar ticks no cambia el cpu total del proceso", () => {
        const p= new Proceso (1, 200, 5)
        
        p.admitir()
        p.despachar()

        p.ejecutarTick()

        expect(p.getCpuTotal()).toBe(5)
    })

    test("un proceso Nuevo no consume Cpu", () => {
        const p = new Proceso(1, 200,5 )

        expect(p.ejecutarTick()).toBe(false)
        expect(p.getCpuRestante()).toBe(5)
        expect(p.getQuantumConsumido()).toBe(0)
    })

    test("un proceso Listo no consume Cpu", () => {
        const p = new Proceso(1, 200, 5)

        p.admitir()

        expect(p.ejecutarTick()).toBe(false)
        expect(p.getCpuRestante()).toBe(5)
        expect(p.getQuantumConsumido()).toBe(0)

    })

    test("el Cpu restante nunca baja de cero", () => {

        const p = new Proceso(1,200,1)

        p.admitir()
        p.despachar()
        p.ejecutarTick()

        expect(p.ejecutarTick()).toBe(false)
        expect(p.getCpuRestante()).toBe(0)
        expect(p.getQuantumConsumido()).toBe(1)
    })

})