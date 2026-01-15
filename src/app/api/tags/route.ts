import { NextRequest, NextResponse } from 'next/server';
import { TagRepository } from '@/infrastructure/repositories/tag.repository';

const tagRepository = new TagRepository();

export async function GET() {
  try {
    const tags = await tagRepository.findAll();

    return NextResponse.json(
      tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        createdAt: tag.createdAt.toISOString(),
      }))
    );
  } catch (error) {
    console.error('Tags fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
