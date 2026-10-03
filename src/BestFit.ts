import type { BloquedeMemoria } from "./BloquedeMemoria"
import { EstrategiadeAsignacion } from "./EstrategiadeAsignacion"

export class BestFit extends EstrategiadeAsignacion{

    protected elegir(candidadtos: BloquedeMemoria[]): BloquedeMemoria | undefined {
        const ordenados = [...candidadtos]. sort((a,b) => a.getTamano() - b.getTamano())
        return ordenados[0]
    }
}