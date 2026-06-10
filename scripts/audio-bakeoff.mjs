// Bake-off TTS — OpenAI vs ElevenLabs (throwaway, NON parte della pipeline).
// Scopo: generare lo stesso testo IT+EN con entrambi i provider per confrontare la
// resa della voce e decidere quale usare per la feature "podcast" degli articoli.
//
// USO:
//   1. Procurati le chiavi (una o entrambe):
//        export OPENAI_API_KEY="sk-..."
//        export ELEVENLABS_API_KEY="..."
//      Opzionali (override delle voci di default):
//        export OPENAI_VOICE="alloy"            # alloy|echo|fable|onyx|nova|shimmer|...
//        export ELEVEN_VOICE_ID="<voice_id>"    # preso dalla tua dashboard ElevenLabs
//   2. node scripts/audio-bakeoff.mjs
//   3. Ascolta i file in ./bakeoff/ e scegli.
//   4. Cancella questo script e la cartella bakeoff/ quando hai deciso.
//
// Richiede Node 18+ (fetch nativo). Nessuna dipendenza npm.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "bakeoff");

// Testo campione: rappresentativo di un articolo tech. Include la frase-segnaposto
// che useremo al posto dei blocchi di codice, così senti anche come suona quella.
const SAMPLES = {
  it: {
    label: "it",
    text: `Quando lavori con un team distribuito su più fusi orari, la code review smette di essere un controllo di qualità e diventa il principale canale di comunicazione tecnica. In questo articolo vediamo come trasformarla da collo di bottiglia a strumento di crescita. Segue un esempio di codice, lo trovi nell'articolo. Il punto chiave non è trovare gli errori, ma allineare il modo in cui il team ragiona sul problema.`,
  },
  en: {
    label: "en",
    text: `When you work with a team spread across several time zones, code review stops being a quality gate and becomes your main channel for technical communication. In this article we look at how to turn it from a bottleneck into a tool for growth. A code example follows, you'll find it in the article. The key point is not catching bugs, but aligning how the team reasons about the problem.`,
  },
};

const OPENAI_VOICE = process.env.OPENAI_VOICE ?? "alloy";
// "Rachel" — voce pubblica di default; con eleven_multilingual_v2 gestisce anche l'IT.
// Per una resa italiana migliore, scegli una voce dedicata dalla tua dashboard e
// passala via ELEVEN_VOICE_ID.
const ELEVEN_VOICE_ID = process.env.ELEVEN_VOICE_ID ?? "21m00Tcm4TlvDq8ikWAM";

async function genOpenAI(sample) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return { skipped: "OPENAI_API_KEY non impostata" };
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      voice: OPENAI_VOICE,
      input: sample.text,
      response_format: "mp3",
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const file = join(OUT_DIR, `openai-${sample.label}.mp3`);
  await writeFile(file, buf);
  return { file, bytes: buf.length };
}

async function genElevenLabs(sample) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return { skipped: "ELEVENLABS_API_KEY non impostata" };
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": key,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: sample.text,
        model_id: "eleven_multilingual_v2",
      }),
    }
  );
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const file = join(OUT_DIR, `elevenlabs-${sample.label}.mp3`);
  await writeFile(file, buf);
  return { file, bytes: buf.length };
}

async function run() {
  await mkdir(OUT_DIR, { recursive: true });
  const jobs = [
    ["OpenAI    IT", () => genOpenAI(SAMPLES.it)],
    ["OpenAI    EN", () => genOpenAI(SAMPLES.en)],
    ["ElevenLabs IT", () => genElevenLabs(SAMPLES.it)],
    ["ElevenLabs EN", () => genElevenLabs(SAMPLES.en)],
  ];
  for (const [name, fn] of jobs) {
    try {
      const r = await fn();
      if (r.skipped) console.log(`⏭️  ${name} — saltato (${r.skipped})`);
      else console.log(`✅ ${name} — ${r.file} (${(r.bytes / 1024).toFixed(0)} KB)`);
    } catch (e) {
      console.log(`❌ ${name} — ${e.message}`);
    }
  }
  console.log(`\nFatto. Ascolta i file in: ${OUT_DIR}`);
}

run();
