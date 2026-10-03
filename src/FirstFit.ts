import type { BloquedeMemoria } from "./BloquedeMemoria"

import {EstrategiadeAsignacion} from "./EstrategiadeAsignacion"



export class FirstFit extends EstrategiadeAsignacion{

    protected elegir(candidatos: BloquedeMemoria[]): BloquedeMemoria | undefined{
        return candidatos[0]
    }

}