import { describe, expect, test } from "vitest";
import { EstadodeProceso } from "../src/EstadodeProceso";

describe ( "Estado de proceso", () => {

    test("Acá se guardan los seis estados del proceso", () => {
        expect (Object.values(EstadodeProceso)).toEqual([
            "Nuevo", "Esperando memoria", "Listo", "Ejecutando", "Bloqueado", "Terminado"
    ]);
});

});