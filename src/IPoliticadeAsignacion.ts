import type { BloquedeMemoria } from "./BloquedeMemoria";

export interface IPoliticadeAsignacion {
    seleccionar(bloques: ReadonlyArray<BloquedeMemoria>, tamano: number): BloquedeMemoria | undefined;
}