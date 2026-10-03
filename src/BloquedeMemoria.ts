export class BloquedeMemoria {
    
    private readonly inicio: number
    private readonly tamano: number 
    private readonly pidAsignado: number | undefined

    constructor(inicio: number, tamano: number, pidAsignado?: number) {

        this.inicio = inicio
        this.tamano = tamano
        this.pidAsignado = pidAsignado
    }

    getInicio(): number{
        return this.inicio
    }

    getTamano(): number {
        return this.tamano

    }

    getPidAsignado(): number | undefined {
        return this.pidAsignado
    }

    estaLibre(): boolean {
        return this.pidAsignado === undefined
    }

}