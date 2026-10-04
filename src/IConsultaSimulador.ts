import type { BloquedeMemoria } from "./BloquedeMemoria"
import type { IProcesoConsulta } from "./IProcesoConsulta"


export interface IConsultaSimulador {

    getTick(): number
    getMapadeMemoria(): ReadonlyArray<BloquedeMemoria>

    getProcesoEnCpu(): IProcesoConsulta | undefined
    getListos(): ReadonlyArray<IProcesoConsulta>


}