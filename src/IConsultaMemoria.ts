import type { BloquedeMemoria } from "./BloquedeMemoria"

export interface IConsultaMemoria {

    getMemoriaTotal(): number
    getBloques(): ReadonlyArray<BloquedeMemoria>
    
}