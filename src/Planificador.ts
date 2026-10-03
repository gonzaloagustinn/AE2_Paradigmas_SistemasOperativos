import { EstadodeProceso } from "./EstadodeProceso"
import type { IConsultadePlanificador } from "./IConsultadePlanificador"
import type { IProcesoConsulta } from "./IProcesoConsulta"
import type { Proceso } from "./Proceso"


export class Planificador implements IConsultadePlanificador {
    private readonly quantum: number
    private cola: Proceso[]
    private ejecutando: Proceso | undefined 

    constructor(quantum: number) {
        this.quantum = quantum
        this.cola = []
        this.ejecutando = undefined

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
}