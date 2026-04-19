import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const OPENROUTER_API_KEY = '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';
const MODEL = 'anthropic/claude-3.5-sonnet:free';

export async function POST(request: NextRequest) {
  try {
    // Optional: Get user if logged in, but don't require it
    const user = await getSessionUser();
    
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const systemPrompt = `You are an expert assistant for Reserve Fund management and property associations. 
You help users with:
- Reserve fund planning and calculations
- Reserve study requirements and best practices
- Component lifecycle and replacement costs
- Inflation rates and rate of return considerations
- Association management guidance
- Financial planning for HOAs and property associations

Provide clear, professional, and helpful responses. Keep answers concise but informative.`;

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Reserve Fund Expert',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map((msg: any) => ({
            role: msg.role === 'bot' ? 'assistant' : msg.role,
            content: msg.message || msg.content,
          })),
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to get response from AI' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content;

    if (!aiMessage) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    return NextResponse.json({ message: aiMessage });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
