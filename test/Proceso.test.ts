import { describe, test, expect } from "vitest";
import { Proceso } from "../src/Proceso";
import { EstadodeProceso } from "../src/EstadodeProceso";


describe("Proceso", () => {
    test("verifica el PID, la memoria requerida y el tiempo total de CPU", () => {
        const p = new Proceso(1, 200, 5);

        expect(p.getPid()).toBe(1);
        expect(p.getMemoriaRequerida()).toBe(200);
        expect(p.getCpuTotal()).toBe(5);
    });

    test("si hago proceso con datos correctos es válido", () => {
        const p = new Proceso(1, 200, 5);

        expect(p.esValido()).toBe(true);
    });
});

describe("PID inválido", () => {
    test("un PID igual a 0 no es válido", () => {
        expect(new Proceso(0, 200, 5).esValido()).toBe(false);
    });



    test("un PID negativo no es válido", () => {
        
        
        expect(new Proceso(-12, 200, 5).esValido()).toBe(false);
    });

    test("un PID que sea decimal no es válido", () => {
        
        
        expect(new Proceso(55.5, 200, 5).esValido()).toBe(false);
    });

    test("un PID que no sea un numero no es válido", () => {
        expect(new Proceso(NaN, 200, 5).esValido()).toBe(false);
    });
});

describe("memoria requerida inválida", () => {
    test("Una memoria que sea igual a 0 no es válida", () => {
        expect(new Proceso(1, 0, 5).esValido()).toBe(false);
    });

    test("una memoria que sea igual negativa no es válida", () => {
        expect(new Proceso(1, -50, 5).esValido()).toBe(false);
    });

    test("una memoria que sea decimal no es válida", () => {
        
        expect(new Proceso(1, 2.5, 5).esValido()).toBe(false);
    });


    test("una memoria no sea un numero no es válido", () => {
        
        expect(new Proceso(1, NaN, 5).esValido()).toBe(false);
    });
});

describe("tiempo de CPU inválido", () => {
    test("Un tiempo de CPU que sea igual a 0 no es válido", () => {
        expect(new Proceso(1, 200, 0).esValido()).toBe(false);
    });

    test("un tiempo de CPU que sea negativo no es válido", () => {
        expect(new Proceso(1, 200, -3).esValido()).toBe(false);

    });

    test("Un tiempo de CPU que sea decimal no es válido", () => {
       
        expect(new Proceso(1, 200, 0.5).esValido()).toBe(false);


    });

    test("Un tiempo de CPU NaN no es válido", () => {
        
        
        expect(new Proceso(1, 200, NaN).esValido()).toBe(false);


    });
});

describe("estado inicial", () =>{

    test("un proceso recien creado debe estar en estado Nuevo", () =>{

        const p = new Proceso(1, 200, 5)

        expect(p.getEstado()).toBe(EstadodeProceso.Nuevo)
    })

    test("un proceso recien creado tiene todo su cpu pendiente", ()=>{

        const p = new Proceso (1, 200, 5)
        expect(p.getCpuRestante()).toBe(5)

    })

    test("un proceo recien creado tiene el quantum consumido en cero"), () => {
        const p = new Proceso (1, 200, 5)

        expect(p.getQuantumConsumido()).toBe(0)
        
    }

    test("un proceso recien creado no tiene bloqueo pendiente",  ()=> {

        const p = new Proceso (1, 200, 5)

        expect(p.getBloqueoRestante()).toBe(0)
    })
})