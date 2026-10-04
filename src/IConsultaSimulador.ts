import type { BloquedeMemoria } from "./BloquedeMemoria"

export interface IConsultaSimulador {

    getTick(): number
    getMapadeMemoria(): ReadonlyArray<BloquedeMemoria>

    
}