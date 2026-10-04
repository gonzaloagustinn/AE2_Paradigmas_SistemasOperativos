import type { IConsultaSimulador } from "../src/IConsultaSimulador"
import type { IPoliticadeAsignacion } from "../src/IPoliticadeAsignacion"
import type { BloquedeMemoria } from "../src/BloquedeMemoria"
import { GestordeMemoria } from "../src/GestordeMemoria"
import { Planificador } from "../src/Planificador"


export class Simulador implements IConsultaSimulador {

    private gestor: GestordeMemoria
    private planificador: Planificador
    private tick: number 

    constructor(memoriaTotal: number, quantum: number, politica: IPoliticadeAsignacion) {

        this.gestor = new GestordeMemoria(memoriaTotal, politica)
        this.planificador = new Planificador (quantum)
        this.tick = 0

    }

    getTick(): number {
        return this.tick

    }

    getMapadeMemoria(): ReadonlyArray<BloquedeMemoria> {
        return this.gestor.getBloques()
    }

    esValido(): boolean {
        return this.gestor.esValido() && this.planificador.esValido()
    }
}