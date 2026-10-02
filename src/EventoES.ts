export class EventoES {
    private readonly TicksCpuparadisparo: number
    private readonly duracion: number

    constructor(TicksCpuparadisparo: number, duracion: number) {
        this.TicksCpuparadisparo = TicksCpuparadisparo
        this.duracion = duracion
        
    }

    getTicksCpuparadisparo(): number {
        return this.TicksCpuparadisparo
    }

    getDuracion(): number {
        return this.duracion
    } 

    esValido(): boolean {
        const ticksValidos = this.TicksCpuparadisparo > 0 && this.TicksCpuparadisparo % 1 === 0;
        const duracionValida = this.duracion > 0 && this.duracion % 1 === 0;

        return ticksValidos && duracionValida;
    }
}