import type { BloquedeMemoria } from "./BloquedeMemoria"
import { EstrategiadeAsignacion } from "./EstrategiadeAsignacion"

export class WorstFit extends EstrategiadeAsignacion{

    protected elegir(candidadtos: BloquedeMemoria[]): BloquedeMemoria | undefined {
        const ordenados = [...candidadtos]. sort((a,b) => b.getTamano() - a.getTamano())
        return ordenados[0]
    }
}