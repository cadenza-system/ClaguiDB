import { NextRequest, NextResponse } from 'next/server';
import { PersonRepository } from '@/infrastructure/repositories/person.repository';

const personRepository = new PersonRepository();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const person = await personRepository.findById(Number(id));

    if (!person) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: person.id,
      names: person.names,
      japaneseMainName: person.getJapaneseMainName(),
      englishMainName: person.getEnglishMainName(),
      bio: person.bio,
      birthYear: person.birthYear,
      deathYear: person.deathYear,
      country: person.country,
      isAlive: person.isAlive(),
      createdAt: person.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Person fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
