import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "estrategias.json");

export interface Estrategia {
  id: string;
  created_at: string;
  updated_at: string;
  nombre_negocio: string;
  rubro: string | null;
  form_data: any;
  secciones: any;
  resumen: string | null;
  socio_id?: string | null;
}

async function ensureDb() {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify([], null, 2));
  }
}

export async function saveEstrategia(estrategiaData: {
  nombre_negocio: string;
  rubro: string | null;
  form_data: any;
  secciones: any;
  resumen: string | null;
  socio_id?: string | null;
}): Promise<Estrategia> {
  await ensureDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const newEstrategia: Estrategia = {
    id,
    created_at: now,
    updated_at: now,
    nombre_negocio: estrategiaData.nombre_negocio,
    rubro: estrategiaData.rubro,
    form_data: estrategiaData.form_data,
    secciones: estrategiaData.secciones,
    resumen: estrategiaData.resumen,
    socio_id: estrategiaData.socio_id || null,
  };

  const fileData = await fs.readFile(DB_PATH, "utf-8");
  const estrategias: Estrategia[] = JSON.parse(fileData);
  estrategias.push(newEstrategia);

  await fs.writeFile(DB_PATH, JSON.stringify(estrategias, null, 2));
  return newEstrategia;
}

export async function listEstrategias(): Promise<Array<{ id: string; nombre_negocio: string; rubro: string | null; created_at: string }>> {
  await ensureDb();
  const fileData = await fs.readFile(DB_PATH, "utf-8");
  const estrategias: Estrategia[] = JSON.parse(fileData);

  return estrategias
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 50)
    .map(({ id, nombre_negocio, rubro, created_at }) => ({
      id,
      nombre_negocio: nombre_negocio,
      rubro,
      created_at,
    }));
}

export async function getEstrategia(id: string): Promise<Estrategia | null> {
  await ensureDb();
  const fileData = await fs.readFile(DB_PATH, "utf-8");
  const estrategias: Estrategia[] = JSON.parse(fileData);
  return estrategias.find((e) => e.id === id) || null;
}
