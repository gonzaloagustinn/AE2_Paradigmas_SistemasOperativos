import { describe, test, expect } from "vitest"
import {EventoES} from "../src/EventoES"
import type { IEventoES } from "../src/IEventoES"


describe("EventoES", () => {
    test("guarda los ticks de cpu para dispararse y la duración", () =>{

        const evento = new EventoES(2,3)

        expect(evento.getTicksCpuParaDisparo()).toBe(2)
        expect(evento.getDuracion()).toBe(3)
    })

    test("un evento con datos correctos es valido", () => {
        expect(new EventoES(2,3).esValido()).toBe(true)

    })

        

    describe("ticks para dispararse invalidos", () => {
        test("unos ticks iguales a cero no son validos", ()=>{

        expect(new EventoES(0, 3).esValido()).toBe(false)

        })

    })

    test("unos ticks negativos no son validos", () =>{
        expect(new EventoES(-1, 3).esValido()).toBe(false)
    })

    test("unos ticks decimales no son validos", () => {
        expect(new EventoES(1.5, 4).esValido()).toBe(false)

    })

    test("unos ticks que no sean numericos no son validos", () => {
        expect(new EventoES(NaN, 3).esValido()).toBe(false)
        
    })

    describe("duración invalida)", () => {
    test("una duración igual a 0 no es valido", () => {
        expect(new EventoES(2, 0).esValido()).toBe(false);
    });


    test("una duración negativa no es valido", () => {
    
        expect(new EventoES(2, -4).esValido()).toBe(false);
    });

    test("una duración decimal no es valido", () => {
    
        expect(new EventoES(2, 0.5).esValido()).toBe(false);
    });

    test("Una duración no numerico no es valido", () => {
    
        expect(new EventoES(2, NaN).esValido()).toBe(false);
    });

 })

        test("se puede usar a traves de la interfaz IEventoES", () => {
        const evento: IEventoES = new EventoES(2, 3)

        expect(evento.getTicksCpuParaDisparo()).toBe(2)
        expect(evento.getDuracion()).toBe(3)
        expect(evento.esValido()).toBe(true)
    })

    

    
})

