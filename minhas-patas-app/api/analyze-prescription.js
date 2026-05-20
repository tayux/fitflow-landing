// Allow up to 10MB body for large PDFs/images
export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { imageBase64, mimeType } = req.body || {};
  if (!imageBase64 || !mimeType) return res.status(400).json({ error: 'Missing imageBase64 or mimeType' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY não configurada no servidor.' });

  const prompt = `Você é um assistente veterinário especializado em análise de receitas.
Analise este arquivo e extraia os medicamentos prescritos.

Retorne APENAS JSON válido, sem markdown, sem texto extra:
{
  "medications": [
    {
      "name": "nome completo do medicamento e concentração",
      "purpose": "para que serve em 1 frase simples e direta",
      "dose": "quantidade numérica como string",
      "unit": "comprimido ou ml ou gotas ou sachê ou ampola",
      "freq": "Diário ou Semanal ou Quinzenal ou Quando necessário",
      "durationDays": número_inteiro_ou_null,
      "suggestedTimes": ["HH:MM"],
      "emoji": "💊"
    }
  ],
  "vet": "nome do veterinário ou null",
  "crmv": "número do CRMV ou null"
}

Regras para suggestedTimes:
- Distribua uniformemente entre 07h e 22h (horários de vigília)
- 1x/dia → ["08:00"]
- 2x/dia → ["08:00","20:00"]
- 3x/dia → ["08:00","14:00","20:00"]
- 4x/dia → ["07:00","12:00","17:00","22:00"]

Se o arquivo não for uma receita veterinária legível:
{"medications":[],"vet":null,"crmv":null,"error":"Não foi possível identificar uma receita veterinária. Tente uma foto mais nítida ou outro arquivo."}`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inline_data: { mime_type: mimeType, data: imageBase64 } },
              { text: prompt },
            ]
          }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
        })
      }
    );

    if (!geminiRes.ok) {
      const detail = await geminiRes.text();
      console.error('Gemini error:', geminiRes.status, detail);
      return res.status(502).json({ error: 'Erro ao contatar a IA. Tente novamente.' });
    }

    const data = await geminiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Strip markdown fences if model added them
    const clean = text.replace(/```json?\n?/g, '').replace(/```\n?/g, '').trim();

    let result;
    try {
      result = JSON.parse(clean);
    } catch {
      console.error('JSON parse error, raw:', text.slice(0, 300));
      return res.status(200).json({
        medications: [],
        error: 'A IA não conseguiu estruturar a resposta. Tente uma foto mais nítida.',
      });
    }

    return res.status(200).json(result);
  } catch (e) {
    console.error('analyze-prescription error:', e);
    return res.status(500).json({ error: 'Erro interno ao analisar a receita.' });
  }
}
