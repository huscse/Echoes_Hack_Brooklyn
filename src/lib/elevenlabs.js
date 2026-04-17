// Voice IDs mapped to styles — using ElevenLabs premade voices
const VOICE_MAP = {
  warm_elderly_man: 'YOUR_VOICE_ID_HERE',
  warm_elderly_woman: 'YOUR_VOICE_ID_HERE',
  middle_aged_man: 'YOUR_VOICE_ID_HERE',
  middle_aged_woman: 'YOUR_VOICE_ID_HERE',
  young_man: 'YOUR_VOICE_ID_HERE',
  young_woman: 'YOUR_VOICE_ID_HERE',
  gravelly_old_man: 'YOUR_VOICE_ID_HERE',
  soft_old_woman: 'YOUR_VOICE_ID_HERE',
};

export async function generateVoice(text, voiceStyle) {
  const voiceId = VOICE_MAP[voiceStyle] || VOICE_MAP.warm_elderly_man;

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.6,
          similarity_boost: 0.8,
          style: 0.3,
          use_speaker_boost: true,
        },
      }),
    },
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs error: ${err}`);
  }

  const audioBuffer = await response.arrayBuffer();
  const base64Audio = Buffer.from(audioBuffer).toString('base64');
  return `data:audio/mpeg;base64,${base64Audio}`;
}
