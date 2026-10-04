import { BloquedeMemoria } from "./BloquedeMemoria"

import type { IConsultaMemoria } from "./IConsultaMemoria"
import type { IGestordeMemoria } from "./IGestordeMemoria"
import type { IPoliticadeAsignacion } from "./IPoliticadeAsignacion"


export class GestordeMemoria implements IConsultaMemoria, IGestordeMemoria {

    private readonly memoriaTotal: number
    private bloques: BloquedeMemoria[]
    private readonly politica: IPoliticadeAsignacion

    constructor(memoriaTotal: number, politica: IPoliticadeAsignacion) {

        this.memoriaTotal = memoriaTotal
        this.bloques = [new BloquedeMemoria(0, memoriaTotal)]
        this.politica = politica
    }

    getMemoriaTotal(): number {
        return this.memoriaTotal
    }

    getBloques(): ReadonlyArray<BloquedeMemoria> {
        return this.bloques
    }

    asignar(pid: number, tamano: number): boolean {

        const elegido = this.politica.seleccionar(this.bloques, tamano)
        const asignado = elegido !== undefined
        const nuevos: BloquedeMemoria[] = []

        for (const bloque of this.bloques) {

            const partes = bloque === elegido
                ? this.dividir(bloque, pid, tamano)
                : [bloque]

            for (const parte of partes) {
                nuevos.push(parte)
            }
        }

        this.bloques = nuevos
        return asignado
    }

        liberar(pid: number): boolean {

        const existe = this.bloques.some(bloque => bloque.getPidAsignado() === pid)

        const liberados = this.bloques.map(bloque =>
            bloque.getPidAsignado() === pid
                ? new BloquedeMemoria(bloque.getInicio(), bloque.getTamano())
                : bloque
        )

        this.bloques = this.coalescer(liberados)
        return existe
    }
    

    private dividir(
        bloque: BloquedeMemoria,
        pid: number,
        tamano: number
    ): BloquedeMemoria[] {

        const resto = bloque.getTamano() - tamano

        const sobrante = resto > 0
            ? [new BloquedeMemoria(
                bloque.getInicio() + tamano,
                resto
            )]
            : []

        return [
            new BloquedeMemoria(
                bloque.getInicio(),
                tamano,
                pid
            ),
            ...sobrante
        ]
    }

    private coalescer(bloques: BloquedeMemoria[]): BloquedeMemoria[] {

        let resultado: BloquedeMemoria[] = []

        for (const actual of bloques) {

            const ultimo = resultado[resultado.length - 1]

            const fusionable =
                ultimo !== undefined &&
                ultimo.estaLibre() &&
                actual.estaLibre()

            const base = fusionable
                ? resultado.slice(0, -1)
                : resultado

            const nuevo = fusionable
                ? new BloquedeMemoria(
                    ultimo.getInicio(),
                    ultimo.getTamano() + actual.getTamano()
                )
                : actual

            base.push(nuevo)
            resultado = base
        }

        return resultado
    }

    getMemorialibretotal(): number {
        let total = 0
        for (const bloque of this.bloques) {
            total = total + (bloque.estaLibre() ? bloque.getTamano() : 0)
        }

        return total 
    }

    getMemoriaocupada(): number {
        return this.memoriaTotal - this.getMemorialibretotal()
    }

        getMayorbloquelibres(): number {
        let mayor = 0
        for (const bloque of this.bloques) {
            mayor = bloque.estaLibre() && bloque.getTamano() > mayor ? bloque.getTamano() : mayor
        }
        return mayor
    }

    


    esValido(): boolean {
        return this.memoriaTotal > 0 && this.memoriaTotal % 1 === 0
    }
}