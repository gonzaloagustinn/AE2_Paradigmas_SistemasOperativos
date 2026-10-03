import type { IProcesoConsulta } from "./IProcesoConsulta"

export interface IConsultadePlanificador { 
    getQuantum(): number 

    getColaListos(): ReadonlyArray<IProcesoConsulta>
    getEjecutando(): IProcesoConsulta | undefined

    
}