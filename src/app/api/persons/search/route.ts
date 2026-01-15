import { NextRequest, NextResponse } from 'next/server';
import { PersonRepository } from '@/infrastructure/repositories/person.repository';

const personRepository = new PersonRepository();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    const persons = await personRepository.search({ query, limit: 50 });

    return NextResponse.json(
      persons.map((person) => ({
        id: person.id,
        names: person.names,
        bio: person.bio,
        birthYear: person.birthYear,
        deathYear: person.deathYear,
        country: person.country,
        createdAt: person.createdAt.toISOString(),
        createdByUserId: person.createdByUserId,
      }))
    );
  } catch (error) {
    console.error('Person search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
