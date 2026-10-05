import type { IConsultaSimulador } from "./IConsultaSimulador"
import type { IProcesoConsulta } from "./IProcesoConsulta"
import type { BloquedeMemoria } from "./BloquedeMemoria"
import type { IMetricas } from "./IMetricas"

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
         + " | Bloqueados: " + this.describirCola(this.simulador.getBloqueados())
         + " | Espera memoria: " + this.describirCola(this.simulador.getEsperandoMemoria())
    
    
    }

    describirMemoria(): string {
        
        const bloques = this.simulador.getMapadeMemoria().map(bloque => this.describirBloque(bloque))
        
        return bloques.join("")
    }

    private describirBloque(bloque: BloquedeMemoria): string {
        
        const nombre = bloque.estaLibre() ? "libre" : "P" + bloque.getPidAsignado()
        const fin = bloque.getInicio() + bloque.getTamano() - 1
        
        return "[" + nombre + " " + bloque.getInicio() + "-" + fin + "]"
    }

    describirMetricas(metricas: IMetricas): string {
        
        return "Ocupacion: " + metricas.getOcupacionMemoria().toFixed(1) + "%"
        
        + " | CPU: " + metricas.getUtilizacionCpu().toFixed(1) + "%"
            + " | Fragmentacion: " + metricas.getFragmentacionexterna().toFixed(1) + "%"
            + " | Cambios de contexto: " + metricas.getCambiosdeContexto()
    }
}
