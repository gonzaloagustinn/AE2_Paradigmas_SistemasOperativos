import type { IConsultaSimulador } from "../src/IConsultaSimulador"
import type { IPoliticadeAsignacion } from "../src/IPoliticadeAsignacion"
import type { BloquedeMemoria } from "../src/BloquedeMemoria"
import { GestordeMemoria } from "../src/GestordeMemoria"
import { Planificador } from "../src/Planificador"
import type { IProcesoConsulta } from "./IProcesoConsulta"
import type { EventoES } from "./EventoES"
import { Proceso } from "./Proceso"


export class Simulador implements IConsultaSimulador {

    private gestor: GestordeMemoria
    private planificador: Planificador
    private tick: number 
    private procesos: Proceso[]

    constructor(memoriaTotal: number, quantum: number, politica: IPoliticadeAsignacion) {

        this.gestor = new GestordeMemoria(memoriaTotal, politica)
        this.planificador = new Planificador (quantum)
        this.tick = 0
        this.procesos = []

    }

    getTick(): number {
        return this.tick

    }

    getMapadeMemoria(): ReadonlyArray<BloquedeMemoria> {
        return this.gestor.getBloques()
    }

    getProcesos(): ReadonlyArray<IProcesoConsulta> {
        return [...this.procesos]
    }

    registrar(pid: number, MemoriaRequerida: number, cpuTotal: number, evento?: EventoES): boolean{

        const proceso = new Proceso(pid, MemoriaRequerida, cpuTotal, evento)
        const duplicado = this.procesos.some(existente => existente.getPid() === pid)
        const cabe = MemoriaRequerida <= this.gestor.getMemoriaTotal()
        
        const aceptado = this.esValido() && proceso.esValido() && !duplicado && cabe
        this.procesos = aceptado ? [...this.procesos, proceso]: this.procesos
        return aceptado 
    }

    esValido(): boolean {
        return this.gestor.esValido() && this.planificador.esValido()
    }
}