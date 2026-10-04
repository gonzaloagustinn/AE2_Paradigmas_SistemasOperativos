import type { IConsultaSimulador } from "../src/IConsultaSimulador"
import type { IPoliticadeAsignacion } from "../src/IPoliticadeAsignacion"
import type { BloquedeMemoria } from "../src/BloquedeMemoria"
import { GestordeMemoria } from "../src/GestordeMemoria"
import { Planificador } from "../src/Planificador"
import type { IProcesoConsulta } from "./IProcesoConsulta"
import type { EventoES } from "./EventoES"
import { Proceso } from "./Proceso"
import { EstadodeProceso } from "./EstadodeProceso"
import type { IMetricas } from "./IMetricas"
import { Metricas } from "./Metricas"


export class Simulador implements IConsultaSimulador {

    private gestor: GestordeMemoria
    private planificador: Planificador
    private tick: number 
    private procesos: Proceso[]
    private tickscpuocupada: number
    private metricas: Metricas

    constructor(memoriaTotal: number, quantum: number, politica: IPoliticadeAsignacion) {

        this.gestor = new GestordeMemoria(memoriaTotal, politica)
        this.planificador = new Planificador (quantum)
        this.tick = 0
        this.procesos = []
        this.tickscpuocupada = 0
        this.metricas = this.calcularMetricas()

    }

    getTick(): number {
        return this.tick

    }

    getMapadeMemoria(): ReadonlyArray<BloquedeMemoria> {
        return this.gestor.getBloques()
    }

    getProcesos(): ReadonlyArray<IProcesoConsulta> {
        return [...this.procesos]
    }

    registrar(pid: number, MemoriaRequerida: number, cpuTotal: number, evento?: EventoES): boolean{

        const proceso = new Proceso(pid, MemoriaRequerida, cpuTotal, evento)
        const duplicado = this.procesos.some(existente => existente.getPid() === pid)
        const cabe = MemoriaRequerida <= this.gestor.getMemoriaTotal()
        
        const aceptado = this.esValido() && proceso.esValido() && !duplicado && cabe
        this.procesos = aceptado ? [...this.procesos, proceso]: this.procesos
        return aceptado 
    }

    avanzarTick(): number {

        this.admitirPendientes()
        this.actualizarbloqueados()
        this.ejecutarCpu()
        
        this.tick = this.tick + (this.esValido() ? 1:0)

        this.metricas = this.calcularMetricas()

        return this.tick
    }

    getProcesoEnCpu(): IProcesoConsulta | undefined {
        return this.planificador.getEjecutando()
    }

    

    getListos(): ReadonlyArray<IProcesoConsulta> {
        return this.planificador.getColaListos()
         }




        getMetricas(): IMetricas {
        return this.metricas 
         }

        private calcularMetricas(): Metricas {
        return new Metricas(
            this.gestor.getMemoriaTotal(),
            this.gestor.getMemorialibretotal(),
            this.gestor.getMayorbloquelibres(),
            this.tickscpuocupada,
            this.tick,
            this.planificador.getcambiosdecontexto()
        )
    }

    esValido(): boolean {
        return this.gestor.esValido() && this.planificador.esValido()
    }

    private admitirPendientes(): void {
        for (const proceso of this.procesos) {
            const estado = proceso.getEstado()
            const pendiente = estado ===EstadodeProceso.Nuevo || estado=== EstadodeProceso.Esperando_Memoria
            const asignado = pendiente && this.gestor.asignar (proceso.getPid(), proceso.getMemoriaRequerida())
            this.ubicar(proceso, pendiente, asignado)
        }
    }

    private ubicar( proceso: Proceso, pendiente : boolean, asignado : boolean): boolean {
        const admitido = asignado && proceso.admitir() && this.planificador.encolar(proceso)
        const espera = pendiente && !asignado && proceso.esperarMemoria()
        return admitido || espera


    }


    private ejecutarCpu(): void {
        this.planificador.despachar()
        const corrio = this.planificador.ejecutarTick()
                this.tickscpuocupada = this.tickscpuocupada + (corrio !== undefined ? 1 : 0)
        this.liberarsiTermino(corrio)
    }

    private liberarsiTermino(proceso: Proceso | undefined): boolean {
        return proceso !== undefined && proceso.getEstado() === EstadodeProceso.Terminado && this.gestor.liberar(proceso.getPid())
    }


     private actualizarbloqueados(): void {

        for (const proceso of this.procesos) {
            this.reencolarsivolvio(proceso)
        }

     }

     private reencolarsivolvio(proceso: Proceso): boolean{
        return proceso.avanzarBloqueo() && this.planificador.encolar(proceso)
     }
    
    
         getEsperandoMemoria(): ReadonlyArray<IProcesoConsulta> {
        return this.filtrarPorEstado(EstadodeProceso.Esperando_Memoria)
    }

    getBloqueados(): ReadonlyArray<IProcesoConsulta> {
        return this.filtrarPorEstado(EstadodeProceso.Bloqueado)
    }

    getTerminados(): ReadonlyArray<IProcesoConsulta> {
        return this.filtrarPorEstado(EstadodeProceso.Terminado)
      }
 
    private filtrarPorEstado(estado: EstadodeProceso): IProcesoConsulta[] {
        return this.procesos.filter(proceso => proceso.getEstado() === estado)
    }

    
}



