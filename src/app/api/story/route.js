import { NextResponse } from 'next/server';
import { researchLocation } from '@/lib/tavily';
import { generateStory } from '@/lib/claude';
import { generateVoice } from '@/lib/elevenlabs';

function addBreaths(text) {
  return text
    .replace(/\. /g, '. <break time="600ms"/> ')
    .replace(/\? /g, '? <break time="600ms"/> ')
    .replace(/\! /g, '! <break time="500ms"/> ')
    .replace(/\, /g, ', <break time="200ms"/> ')
    .replace(/— /g, '<break time="700ms"/> ');
}

export async function POST(req) {
  try {
    const { address, lat, lng } = await req.json();

    if (!address) {
      return NextResponse.json({ error: 'Missing address' }, { status: 400 });
    }

    console.log(`Generating story for: ${address}`);

    const { research, summary, sources } = await researchLocation(
      address,
      lat,
      lng,
    );
    const storyData = await generateStory(address, research, summary);

    const storyText = addBreaths(storyData.title + '. ' + storyData.story);
    const introText = storyData.intro ? addBreaths(storyData.intro) : null;

    const [introAudio, storyAudio] = await Promise.all([
      introText
        ? generateVoice(introText, 'middle_aged_woman')
        : Promise.resolve(null),
      generateVoice(storyText, storyData.voice_style),
    ]);

    return NextResponse.json({
      ...storyData,
      introAudio,
      audio: storyAudio,
      sources,
      coordinates: { lat, lng },
    });
  } catch (err) {
    console.error('Story generation error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to generate story' },
      { status: 500 },
    );
  }
}
