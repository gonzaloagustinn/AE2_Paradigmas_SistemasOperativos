import { EstadodeProceso } from "./EstadodeProceso"
import type { IConsultadePlanificador } from "./IConsultadePlanificador"
import type { IProcesoConsulta } from "./IProcesoConsulta"
import type { Proceso } from "./Proceso"


export class Planificador implements IConsultadePlanificador {
    private readonly quantum: number
    private cola: Proceso[]
    private ejecutando: Proceso | undefined 
    private cambiosdeContexto: number

    constructor(quantum: number) {
        this.quantum = quantum
        this.cola = []
        this.ejecutando = undefined
        this.cambiosdeContexto = 0

    }

    getQuantum(): number {
        return this.quantum
    }

    getColaListos(): ReadonlyArray<IProcesoConsulta> {
        return [...this.cola]

    }

    getEjecutando(): IProcesoConsulta | undefined {
        return this.ejecutando
    }

        getcambiosdecontexto(): number {
        return this.cambiosdeContexto
    }

    esValido(): boolean {
        return this.quantum > 0 && this.quantum % 1 === 0
    }

    encolar(proceso: Proceso): boolean {

        const esListo = proceso.getEstado() === EstadodeProceso.Listo

        const repetido = this.cola.includes(proceso) || this.ejecutando ===proceso 
        const aceptado = esListo && !repetido 


        this.cola = aceptado ? [...this.cola, proceso] : this.cola 
        return aceptado  
    }

    despachar(): boolean {
        const siguiente = this.cola[0]

        const puede = siguiente !== undefined && this.ejecutando === undefined
        const despachado = puede && siguiente.despachar()
        this.cola = despachado ? this.cola.slice(1) : this.cola


        this.ejecutando = despachado ? siguiente : this.ejecutando
        return despachado

    }

    ejecutarTick(): Proceso | undefined {
        const actual = this.ejecutando
        return actual === undefined ? undefined : this.consumir(actual)

    }

    private consumir(proceso: Proceso): Proceso | undefined {
        const corrio = proceso.ejecutarTick()
        const termino = corrio && proceso.getCpuRestante() === 0 && proceso.terminar()
        const bloqueado = corrio && !termino && proceso.bloquear()
        const agotado = corrio && !termino && !bloqueado && proceso.getQuantumConsumido() === this.quantum
        const hayOtros = this.cola.length > 0
        const expulsado = agotado && hayOtros && proceso.expulsar()
        this.cola = expulsado ? [...this.cola, proceso] : this.cola
        this.ejecutando = termino || bloqueado || expulsado ? undefined : this.ejecutando
        this.cambiosdeContexto = this.cambiosdeContexto + (bloqueado || expulsado ? 1 : 0)
        return corrio ? proceso : undefined
    }



}