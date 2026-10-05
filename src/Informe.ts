import type { IConsultaSimulador } from "./IConsultaSimulador"

export class Informe {

    private readonly simulador: IConsultaSimulador

    constructor(simulador: IConsultaSimulador) {
        
        this.simulador = simulador


    }


    describirTick(): string {

        return "Tick " + this.simulador.getTick()

    }
}