import type { IConsultaSimulador } from "./IConsultaSimulador"

export class Informe {

    private readonly simulador: IConsultaSimulador

    constructor(simulador: IConsultaSimulador) {
        
        this.simulador = simulador


    }

    private describirCpu(): string {
        const proceso = this.simulador.getProcesoEnCpu()
        return proceso === undefined ? "-" : "P" + proceso.getPid()
    }

    describirTick(): string {

        return "Tick " + this.simulador.getTick() + " | CPU: " + this.describirCpu()

    }
}