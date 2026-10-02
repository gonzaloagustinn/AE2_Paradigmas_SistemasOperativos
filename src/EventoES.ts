export class EventoES {
    private readonly ticksCpuParaDisparo: number;
    private readonly duracion: number;
    

    constructor(ticksCpuParaDisparo: number, duracion: number) {
        this.ticksCpuParaDisparo = ticksCpuParaDisparo;
        this.duracion = duracion;
    }

    getTicksCpuParaDisparo(): number {
        return this.ticksCpuParaDisparo;
    }

    getDuracion(): number {
        return this.duracion;
    }

    esValido(): boolean {
        const ticksValidos = this.ticksCpuParaDisparo > 0 && this.ticksCpuParaDisparo % 1 === 0;
        const duracionValida = this.duracion > 0 && this.duracion % 1 === 0;

        return ticksValidos && duracionValida;
    }
}