export interface IGestordeMemoria {

    asignar (pid: number, tamano: number ) : boolean
    liberar (pid: number): boolean
}