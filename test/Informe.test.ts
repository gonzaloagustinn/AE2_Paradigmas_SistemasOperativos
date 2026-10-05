import { test, describe, expect } from "vitest"
import { Simulador } from "../src/Simulador"
import { FirstFit } from "../src/FirstFit"
import { Informe } from "../src/Informe" 

describe("reporte de un tick", () => {
    test("al inicio informa el tick 0", () => {
        const reporte = new Informe(new Simulador(1024, 2, new FirstFit()))
        expect(reporte.describirTick()).toBe("Tick 0")
    })
})