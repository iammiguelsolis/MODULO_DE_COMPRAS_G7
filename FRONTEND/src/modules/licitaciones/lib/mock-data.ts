import type { Licitacion } from "./types";
import { estados_li } from "./constants";

export const allLicitaciones: Licitacion[] = Array.from(
  { length: 400 },
  (_, i) => ({
    id: `2025${String(i + 1).padStart(3, "0")}`,
    titulo: `Equipo de Cómputo #${i + 1}`,
    fechaCreacion: new Date(2025, 0, 1 + i).toISOString().split("T")[0],
    presupuesto: 10000 + ((i * 1337) % 149000) + i * 3.14,
    estado: estados_li[i % estados_li.length],
  })
);
