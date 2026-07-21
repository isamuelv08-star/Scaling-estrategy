import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { saveEstrategia, listEstrategias, getEstrategia } from "./src/db.ts";

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));

const PORT = 3000;

// Expose the same single endpoint logic under /api/estrategias
app.post("/api/estrategias", async (req, res) => {
  // Set CORS headers
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");

  try {
    const { action } = req.body;
    if (action === "generate") {
      return await handleGenerate(req, res);
    }
    if (action === "save") {
      return await handleSave(req, res);
    }
    if (action === "list") {
      return await handleList(req, res);
    }
    if (action === "get") {
      return await handleGet(req, res);
    }
    return res.status(400).json({ error: "Acción no reconocida" });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

// We should also handle OPTIONS for CORS preflight
app.options("/api/estrategias", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.sendStatus(204);
});

async function handleGenerate(req: express.Request, res: express.Response) {
  const { system, messages, tools, max_tokens } = req.body;

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "Falta configurar la clave ANTHROPIC_API_KEY en los secrets." });
  }

  try {
    console.log("Generando con Anthropic (Claude)...");
    const anthropicModel = "claude-3-5-sonnet-20241022";
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: anthropicModel,
        max_tokens: max_tokens || 1500, // Optimized default token output limit to avoid rate limits
        system,
        messages,
        ...(tools ? { tools } : {}),
      }),
    });

    const data = await anthropicRes.json() as any;
    if (anthropicRes.ok) {
      console.log("Generación con Anthropic exitosa.");
      return res.status(200).json(data);
    }
    
    return res.status(anthropicRes.status).json({
      error: data?.error?.message || "Error llamando a Anthropic",
      status: anthropicRes.status,
    });
  } catch (err) {
    console.error("Error llamando a Anthropic:", err);
    return res.status(500).json({ error: "Error de red llamando a la API de Anthropic: " + String(err) });
  }
}

async function handleSave(req: express.Request, res: express.Response) {
  const { nombreNegocio, rubro, formData, secciones, resumen } = req.body;
  if (!nombreNegocio || !secciones) {
    return res.status(400).json({ error: "Faltan campos requeridos (nombreNegocio, secciones)" });
  }
  try {
    const saved = await saveEstrategia({
      nombre_negocio: nombreNegocio,
      rubro: rubro || null,
      form_data: formData || {},
      secciones,
      resumen: resumen || null,
    });
    return res.status(200).json({ id: saved.id, created_at: saved.created_at });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}

async function handleList(req: express.Request, res: express.Response) {
  try {
    const list = await listEstrategias();
    return res.status(200).json({ estrategias: list });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}

async function handleGet(req: express.Request, res: express.Response) {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Falta el id" });
  }
  try {
    const estrategia = await getEstrategia(id);
    if (!estrategia) {
      return res.status(404).json({ error: "Estrategia no encontrada" });
    }
    return res.status(200).json({ estrategia });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}

// Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
