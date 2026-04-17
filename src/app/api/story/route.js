import { NextResponse } from 'next/server';
import { researchLocation } from '@/lib/tavily';
import { generateStory } from '@/lib/claude';
import { generateVoice } from '@/lib/elevenlabs';

export async function POST(req) {
  try {
    const { address, lat, lng } = await req.json();

    if (!address || !lat || !lng) {
      return NextResponse.json(
        { error: 'Missing address or coordinates' },
        { status: 400 },
      );
    }

    console.log(`Generating story for: ${address}`);

    // Step 1: Research the location
    const { research, summary } = await researchLocation(address, lat, lng);

    // Step 2: Generate narrative with Claude
    const storyData = await generateStory(address, research, summary);

    // Step 3: Generate voice with ElevenLabs
    const audioData = await generateVoice(
      storyData.story,
      storyData.voice_style,
    );

    return NextResponse.json({
      ...storyData,
      audio: audioData,
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
