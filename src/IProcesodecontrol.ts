export interface IProcesodeControl {
    
    admitir(): boolean;

    esperarMemoria(): boolean;
    despachar(): boolean;
    expulsar(): boolean;
    terminar(): boolean;

    ejecutarTick(): boolean;
    

}