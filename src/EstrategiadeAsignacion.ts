import type { BloquedeMemoria } from "./BloquedeMemoria";


import type { IPoliticadeAsignacion } from "./IPoliticadeAsignacion";




export abstract class EstrategiadeAsignacion implements IPoliticadeAsignacion {
    
    seleccionar(bloques: ReadonlyArray<BloquedeMemoria>, tamano: number): BloquedeMemoria | undefined {
        
        
        const candidatos = bloques.filter(bloque => bloque.estaLibre() && bloque.getTamano() >= tamano);

        return this.elegir(candidatos);
    }

    
    
    protected abstract elegir(candidatos: BloquedeMemoria[]): BloquedeMemoria | undefined;





}