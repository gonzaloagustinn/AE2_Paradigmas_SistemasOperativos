import { BloquedeMemoria } from "./BloquedeMemoria"

import type { IConsultaMemoria } from "./IConsultaMemoria"

export class GestordeMemoria implements IConsultaMemoria {
    private readonly memoriaTotal: number
    private bloques: BloquedeMemoria[]

    constructor(memoriaTotal: number) {

        this.memoriaTotal = memoriaTotal
        this.bloques = [ new BloquedeMemoria(0, memoriaTotal)]
    }

    getMemoriaTotal(): number {
        return this.memoriaTotal

    }

    getBloques(): ReadonlyArray<BloquedeMemoria> {
        return this.bloques
    }

    esValido(): boolean {
        return this.memoriaTotal > 0 && this.memoriaTotal % 1 === 0
    }
}