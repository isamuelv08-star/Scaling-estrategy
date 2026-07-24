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
        .is("user_id", null)
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
        .is("user_id", null)
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

      const { system, messages, tools, max_tokens, model } = body;

      try {
        const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicApiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: model || "claude-sonnet-4-6",
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

    if (action === "check_credit") {
      const { user_id } = body;
      if (!user_id) {
        return new Response(JSON.stringify({ error: "Falta user_id" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      // Check if profile exists; if not, create default profile with 1 free credit
      const { data: profile } = await supabase
        .from("perfiles")
        .select("*")
        .eq("user_id", user_id)
        .maybeSingle();

      if (!profile) {
        await supabase.from("perfiles").upsert({
          user_id,
          creditos_gratis_limite: 1,
          creditos_gratis_usados: 0,
          acceso_ilimitado: false
        }, { onConflict: "user_id" });
      } else if (profile.acceso_ilimitado) {
        return new Response(JSON.stringify({ exito: true, ilimitado: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      try {
        const { data, error } = await supabase.rpc("consumir_credito", { p_user_id: user_id });
        if (!error && data && data.length > 0) {
          return new Response(JSON.stringify(data[0]), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }
      } catch (rpcErr) {
        console.warn("RPC consumir_credito falló o no existe, usando fallback:", rpcErr);
      }

      // Fallback manual de consumo de créditos
      const { data: currentProfile } = await supabase
        .from("perfiles")
        .select("*")
        .eq("user_id", user_id)
        .maybeSingle();

      if (currentProfile?.acceso_ilimitado) {
        return new Response(JSON.stringify({ exito: true, ilimitado: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      const usados = currentProfile?.creditos_gratis_usados ?? 0;
      const limite = currentProfile?.creditos_gratis_limite ?? 1;

      if (usados < limite) {
        await supabase
          .from("perfiles")
          .update({ creditos_gratis_usados: usados + 1 })
          .eq("user_id", user_id);

        return new Response(JSON.stringify({ exito: true, restantes: limite - (usados + 1) }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      } else {
        return new Response(JSON.stringify({ exito: false, restantes: 0 }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }

    if (action === "redeem_code") {
      const { user_id, codigo } = body;
      if (!user_id || !codigo) {
        return new Response(JSON.stringify({ error: "Faltan datos" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      const { data: codigoData, error: codigoError } = await supabase
        .from("codigos_acceso")
        .select("*")
        .eq("codigo", codigo.trim().toUpperCase())
        .is("usado_por", null)
        .single();

      if (codigoError || !codigoData) {
        return new Response(JSON.stringify({ error: "Código inválido o ya usado" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      await supabase
        .from("codigos_acceso")
        .update({ usado_por: user_id, usado_en: new Date().toISOString() })
        .eq("codigo", codigoData.codigo);

      await supabase
        .from("perfiles")
        .update({ acceso_ilimitado: true })
        .eq("user_id", user_id);

      return new Response(JSON.stringify({ exito: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
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
