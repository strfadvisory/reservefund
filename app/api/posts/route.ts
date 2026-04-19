import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { ACTIVITY_EVENTS, logActivity } from '@/lib/activity';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, friend } = body;

    // Validate required fields
    if (!title || !description || !friend) {
      return NextResponse.json(
        { error: 'Title, description, and friend are required' },
        { status: 400 }
      );
    }

    // Create new post
    const post = await prisma.post.create({
      data: {
        title,
        description,
        friend,
      },
    });

    const user = await getSessionUser();
    if (user) {
      await logActivity({
        event: ACTIVITY_EVENTS.POST_CREATED,
        ownerUserId: user.id,
        actor: user,
        description: `Created post "${post.title}"`,
        metadata: { postId: post.id },
      });
    }

    return NextResponse.json(
      { message: 'Post created successfully', post },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create post' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
