import type { IMetricas } from "./IMetricas"

export class Metricas implements IMetricas {

    private readonly memoriaTotal: number
    private readonly memoriaLibreTotal: number
    private readonly ticksCpuOcupada: number
    private readonly ticksTranscurridos: number
    private readonly cambiosdeContexto: number


    private readonly mayorBloqueLibre: number

    constructor(memoriaTotal: number, memoriaLibreTotal: number, mayorBloqueLibre: number, ticksCpuOcupada: number, ticksTranscurridos: number, cambiosdeContexto: number) {
        this.memoriaTotal = memoriaTotal


        this.memoriaLibreTotal = memoriaLibreTotal

        this.mayorBloqueLibre = mayorBloqueLibre

        this.ticksCpuOcupada = ticksCpuOcupada

        this.ticksTranscurridos = ticksTranscurridos

        this.cambiosdeContexto = cambiosdeContexto

    }

    getOcupacionMemoria(): number {
        return 100 * (this.memoriaTotal - this.memoriaLibreTotal) / this.memoriaTotal
    }

    getMemoriaLibreTotal(): number {
        return this.memoriaLibreTotal
    }

    getMayorbloqueLibre(): number {
        return this.mayorBloqueLibre
    }

    getFragmentacionexterna(): number {
        return this.memoriaLibreTotal === 0 ? 0 : 100 * (1 - this.mayorBloqueLibre / this.memoriaLibreTotal)
    }

    getUtilizacionCpu(): number {
        return this.ticksTranscurridos === 0 ? 0 : 100 * this.ticksCpuOcupada / this.ticksTranscurridos
    }

    getCambiosdeContexto(): number {
       
        return this.cambiosdeContexto
    }
}