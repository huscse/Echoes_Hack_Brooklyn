// Voice IDs mapped to styles — using ElevenLabs premade voices
const VOICE_MAP = {
  warm_elderly_man: 'ch0vU2DwfJVmFG2iZy89',
  warm_elderly_woman: 'tE1KlkSzdHDpi3dDzO60',
  middle_aged_man: 'VQWIG7jHNSEv826utbm8',
  middle_aged_woman: 'MnUw1cSnpiLoLhpd3Hqp',
  young_man: 'wSqOdjeNqDrHcoK0zorF',
  young_woman: 'TbMNBJ27fH2U0VgpSNko',
  gravelly_old_man: 'Q4oILuo4P8VeXtE6FMLI',
  soft_old_woman: 'GpOshR6AeCDz0A9MCHKJ',
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
        text: `<speak>${text}</speak>`,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.3,
          similarity_boost: 0.75,
          style: 0.6,
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
