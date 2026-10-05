import type { IConsultaSimulador } from "./IConsultaSimulador"
import type { IProcesoConsulta } from "./IProcesoConsulta"

export class Informe {

    private readonly simulador: IConsultaSimulador

    constructor(simulador: IConsultaSimulador) {
        
        this.simulador = simulador


    }

    private describirCpu(): string {
        const proceso = this.simulador.getProcesoEnCpu()
        return proceso === undefined ? "-" : "P" + proceso.getPid()
    }

    private describirCola(cola: ReadonlyArray<IProcesoConsulta>): string {
        const nombres = cola.map(proceso => "P" + proceso.getPid())
    
        return nombres.length === 0 ? "-" : nombres.join(",")
    
    }

    describirTick(): string {

        return "Tick " + this.simulador.getTick()
         + " | CPU: " + this.describirCpu()
         + " | Listos: " + this.describirCola(this.simulador.getListos())
    }


    }
