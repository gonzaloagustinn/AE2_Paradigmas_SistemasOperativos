import type { EstadodeProceso } from "./EstadodeProceso";

export interface IProcesoConsulta {
    getPid(): number;
    getEstado(): EstadodeProceso;
    getMemoriaRequerida(): number;
    getCpuTotal(): number;
    getCpuRestante(): number;
    getQuantumConsumido(): number;
    getBloqueoRestante(): number;
    bloquear(): boolean;
    avanzarBloqueo(): boolean;
}