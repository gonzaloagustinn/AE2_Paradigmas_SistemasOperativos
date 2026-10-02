import { EstadodeProceso } from "./EstadodeProceso";
import type { IProcesoConsulta } from "./IProcesoConsulta";
import { IProcesodeControl } from "./IProcesodecontrol";
import { EventoES } from "./EventoES";

export class Proceso implements IProcesoConsulta, IProcesodeControl {
    private readonly pid: number;
    private readonly memoriaRequerida: number;
    private readonly cpuTotal: number;
    private cpuRestante: number
    private quantumConsumido: number
    private bloqueoRestante: number
    private estado: EstadodeProceso
    private evento: EventoES | undefined
    


        constructor(pid: number, memoriaRequerida: number, cpuTotal: number, evento?: EventoES)  {
        this.pid = pid;
        this.memoriaRequerida = memoriaRequerida;
        this.cpuTotal = cpuTotal;
        this.cpuRestante = cpuTotal
        this.quantumConsumido = 0;
        this.bloqueoRestante = 0
        this.estado = EstadodeProceso.Nuevo;
        this.evento = evento;

    }

    getPid(): number {
        return this.pid;
    }

    getMemoriaRequerida(): number {
        return this.memoriaRequerida;
    }

    getCpuTotal(): number {
        return this.cpuTotal;
    }

    getEstado(): EstadodeProceso {
        return this.estado
    }


    getCpuRestante(): number {
        return this.cpuRestante

    }

    getQuantumConsumido(): number {
        return this.quantumConsumido
    }


    getBloqueoRestante(): number {
        return this.bloqueoRestante
    }

    admitir(): boolean {
        return this.transicionarA(EstadodeProceso.Listo, [EstadodeProceso.Nuevo, EstadodeProceso.Esperando_Memoria]);

    }

       esperarMemoria(): boolean {
        return this.transicionarA(EstadodeProceso.Esperando_Memoria, [EstadodeProceso.Nuevo]);
    }

    despachar(): boolean {
        return this.transicionarA(EstadodeProceso.Ejecutando, [EstadodeProceso.Listo]);
    }

    expulsar(): boolean {
        return this.transicionarA(EstadodeProceso.Listo, [EstadodeProceso.Ejecutando]);
    }

    terminar(): boolean {
        return this.transicionarA(EstadodeProceso.Terminado, [EstadodeProceso.Ejecutando]);
    }


    ejecutarTick(): boolean {
        const puedeEjecutar = this.estado === EstadodeProceso.Ejecutando && this.cpuRestante > 0;
        this.cpuRestante = puedeEjecutar ? this.cpuRestante - 1 : this.cpuRestante;
        this.quantumConsumido = puedeEjecutar ? this.quantumConsumido + 1 : this.quantumConsumido;
        return puedeEjecutar;
    }

        bloquear(): boolean {
        const ticksConsumidos = this.cpuTotal - this.cpuRestante;
        const ticksDeDisparo = this.evento?.getTicksCpuParaDisparo();
        const seDispara = ticksConsumidos === ticksDeDisparo && this.cpuRestante > 0;
        const duracion = this.evento?.getDuracion() ?? 0;
        const bloqueado = seDispara && this.transicionarA(EstadodeProceso.Bloqueado, [EstadodeProceso.Ejecutando]);

        this.bloqueoRestante = bloqueado ? duracion : this.bloqueoRestante;
        this.evento = bloqueado ? undefined : this.evento;
        return bloqueado;
    }

    avanzarBloqueo(): boolean {
        const estaBloqueado = this.estado === EstadodeProceso.Bloqueado;

        this.bloqueoRestante = estaBloqueado ? this.bloqueoRestante - 1 : this.bloqueoRestante;
        return estaBloqueado && this.bloqueoRestante === 0 && this.transicionarA(EstadodeProceso.Listo, [EstadodeProceso.Bloqueado]);
    }

    esValido(): boolean {
        const pidValido = this.pid > 0 && this.pid % 1 === 0;
        const memoriaValida = this.memoriaRequerida > 0 && this.memoriaRequerida % 1 === 0;
        const cpuValido = this.cpuTotal > 0 && this.cpuTotal % 1 === 0;
        const eventoValido = this.evento === undefined || this.evento.esValido();

        return pidValido && memoriaValida && cpuValido && eventoValido;
    }

        private transicionarA(destino: EstadodeProceso, origenesPermitidos: EstadodeProceso[]): boolean {
        const permitido = origenesPermitidos.includes(this.estado);
        this.estado = permitido ? destino : this.estado;
        return permitido;
    }


    
}