import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, ...body } = await req.json();

    if (action === "list") {
      const { data, error } = await supabase
        .from("estrategias")
        .select("id, nombre_negocio, rubro, created_at")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return new Response(JSON.stringify({ estrategias: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (action === "get") {
      const { id } = body;
      if (!id) {
        return new Response(JSON.stringify({ error: "Falta el id" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      const { data, error } = await supabase
        .from("estrategias")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return new Response(JSON.stringify({ estrategia: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (action === "save") {
      const { nombreNegocio, rubro, formData, secciones, resumen, socio_id } = body;
      if (!nombreNegocio || !secciones) {
        return new Response(JSON.stringify({ error: "Faltan campos requeridos" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      const { data, error } = await supabase
        .from("estrategias")
        .insert({
          nombre_negocio: nombreNegocio,
          rubro: rubro || null,
          form_data: formData || {},
          secciones: secciones || [],
          resumen: resumen || null,
          socio_id: socio_id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify({ id: data.id, created_at: data.created_at }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (action === "generate") {
      const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");
      if (!anthropicApiKey) {
        return new Response(JSON.stringify({ error: "Falta configurar ANTHROPIC_API_KEY en Supabase." }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }

      const { system, messages, tools, max_tokens } = body;

      try {
        const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicApiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: max_tokens || 1500, // Optimized token limit
            system,
            messages,
            ...(tools ? { tools } : {}),
          }),
        });

        const data = await anthropicRes.json();
        if (anthropicRes.ok) {
          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }
        
        return new Response(JSON.stringify({
          error: data?.error?.message || "Error llamando a Anthropic",
          status: anthropicRes.status,
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: anthropicRes.status,
        });
      } catch (err) {
        return new Response(JSON.stringify({
          error: "Error de conexión llamando a Anthropic: " + String(err)
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }
    }

    return new Response(JSON.stringify({ error: "Acción no reconocida" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err.message || err) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
