import { describe, test, expect  } from "vitest"
import { EstrategiadeAsignacion } from "../src/EstrategiadeAsignacion"
import { BloquedeMemoria } from "../src/BloquedeMemoria"

class EstrategiadePrueba extends EstrategiadeAsignacion {

    protected elegir(candidatos: BloquedeMemoria[]): BloquedeMemoria | undefined {
        return candidatos[0]

    }

}

describe("estrategia de asignacion", () => {
    test("entrega a elegir solo bloques libres que alcanzan", () =>{

        const bloques = [

            new BloquedeMemoria(0, 100, 1),
            new BloquedeMemoria(100, 30),
            new BloquedeMemoria(130, 200)
        ]

        const elegido = new EstrategiadePrueba().seleccionar(bloques, 50)

        expect(elegido?.getInicio()).toBe(130)
    })

    test("si ningun bloque libre alcanza, devuelve undefined", () => {

        const bloques = [new BloquedeMemoria(0, 30)]

        const elegido = new EstrategiadePrueba().seleccionar(bloques, 50)

        expect(elegido).toBe(undefined)
    })
})