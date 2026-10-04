export interface IMetricas {
    getOcupacionMemoria(): number
    getMemoriaLibreTotal(): number

    getMayorbloqueLibre(): number

    getFragmentacionexterna(): number

    getUtilizacionCpu(): number
    
    getCambiosdeContexto(): number


}