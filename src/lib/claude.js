import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateStory(address, research, summary) {
  const prompt = `You are writing a short first-person monologue for a location-based audio storytelling app called Echoes.

Location: ${address}, Brooklyn, New York

Historical research about this location:
${summary}

${research}

Your task:
1. Create a fictional narrator who is plausible for this location and era (a tenant, shopkeeper, neighbor, worker, child who grew up there, etc.)
2. Write a 60-80 word first-person monologue in their voice about what they witnessed or experienced at this specific place
3. Ground the story in real historical facts from the research above
4. Make it emotional, specific, and vivid — not generic
5. Do NOT make up specific names of real people or claim it's a real person's account
6. End with something that lingers

Also provide:
- ERA: The approximate year or decade (e.g. "1943", "1970s", "Late 1980s")
- NARRATOR: A brief description of who is speaking (e.g. "Elderly Puerto Rican woman, longtime resident")
- VOICE_STYLE: One of these ElevenLabs voice styles that best fits: [warm_elderly_woman, warm_elderly_man, middle_aged_woman, middle_aged_man, young_woman, young_man, gravelly_old_man, soft_old_woman]

Respond in this exact JSON format:
{
  "story": "The monologue text here...",
  "era": "1970s",
  "narrator": "Description of narrator",
  "voice_style": "warm_elderly_man",
  "address_display": "Short display version of address"
}`;

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].text;

  try {
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    // Fallback parse if JSON is malformed
    return {
      story: text,
      era: 'Unknown era',
      narrator: 'Anonymous voice',
      voice_style: 'warm_elderly_man',
      address_display: address,
    };
  }
}
