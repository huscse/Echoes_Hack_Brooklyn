import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateStory(address, research, summary) {
  const prompt = `You are writing a short first-person spoken monologue for a location-based audio storytelling app called Echoes.

Location: ${address}

Historical research about this location:
${summary}

${research}

Your task is to write something that sounds like a real person SPEAKING out loud, not writing. It should feel raw, unscripted, and natural, like someone telling you a story on their stoop.

Rules:
- NEVER use em dashes (--) or hyphens used as dashes. Use commas or periods instead.
- Write how people actually talk. Short sentences. Pauses. Repetition. Trailing thoughts.
- ALWAYS mention the specific place by name (Brooklyn College, the Navy Yard, Fulton Street, etc.) at least once naturally in the story.
- Ground every detail in the historical research provided. Do not invent facts.
- The narrator is a fictional composite, not a real person. Make them feel real and specific though.
- 60 to 80 words. No more.
- No flowery language. No dramatic conclusions. Just honest memory.

Good example of tone:
"I used to walk past the Navy Yard every morning. My uncle worked gate three, welding. This was the forties, wartime. You could smell the metal from two blocks away. Everybody in Red Hook had somebody in there. When they shut it down, it was like the neighborhood lost its heartbeat. Just like that. Gone."

Bad example (too formal, avoid this):
"Standing before this institution, one recalls the profound impact that the WPA initiative had upon the working class during the Great Depression era."

Also provide:
- A short TITLE (4 to 6 words, the name of the place or a phrase that captures the story)
- ERA: The approximate year or decade
- NARRATOR: Brief description (age, background, connection to place)
- VOICE_STYLE: One of: warm_elderly_woman, warm_elderly_man, middle_aged_woman, middle_aged_man, young_woman, young_man
- CONTEXT: One sentence of factual background that helps the listener understand what they just heard. Mention the real place name.

Respond in this exact JSON format with no extra text:
{
  "title": "Short evocative title here",
  "story": "The spoken monologue here...",
  "context": "One factual sentence giving the listener real historical context about this place.",
  "era": "1940s",
  "narrator": "Retired dockworker, Red Hook resident",
  "voice_style": "warm_elderly_man",
  "address_display": "Short clean version of the address"
}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].text;

  try {
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      title: 'A Brooklyn Story',
      story: text,
      context: '',
      era: 'Unknown era',
      narrator: 'Anonymous voice',
      voice_style: 'warm_elderly_man',
      address_display: address,
    };
  }
}
