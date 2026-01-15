import { prisma } from '../database/prisma';
import { IPersonRepository } from '@/domain/person/person.repository.interface';
import { Person } from '@/domain/person/person.entity';
import {
  PersonId,
  CreatePersonInput,
  UpdatePersonInput,
  PersonSearchCriteria,
} from '@/domain/person/person.types';

export class PersonRepository implements IPersonRepository {
  async findById(id: PersonId): Promise<Person | null> {
    const person = await prisma.person.findUnique({
      where: { id, deletedAt: null },
      include: {
        personNames: {
          where: { deletedAt: null },
        },
      },
    });

    if (!person) return null;

    return this.toDomain(person);
  }

  async search(criteria: PersonSearchCriteria): Promise<Person[]> {
    const persons = await prisma.person.findMany({
      where: {
        deletedAt: null,
        ...(criteria.query && {
          personNames: {
            some: {
              name: { contains: criteria.query },
              deletedAt: null,
            },
          },
        }),
        ...(criteria.country && { country: criteria.country }),
        ...(criteria.isAlive !== undefined && {
          deathYear: criteria.isAlive ? null : { not: null },
        }),
      },
      include: {
        personNames: {
          where: { deletedAt: null },
        },
      },
      take: criteria.limit,
      skip: criteria.offset,
    });

    return persons.map((p) => this.toDomain(p));
  }

  async create(input: CreatePersonInput): Promise<Person> {
    const person = await prisma.person.create({
      data: {
        bio: input.bio,
        birthYear: input.birthYear,
        deathYear: input.deathYear,
        country: input.country,
        createdByUserId: input.createdByUserId,
        personNames: {
          create: input.names.map((name) => ({ name })),
        },
      },
      include: {
        personNames: true,
      },
    });

    return this.toDomain(person);
  }

  async update(id: PersonId, input: UpdatePersonInput): Promise<Person> {
    const person = await prisma.person.update({
      where: { id },
      data: {
        bio: input.bio,
        birthYear: input.birthYear,
        deathYear: input.deathYear,
        country: input.country,
      },
      include: {
        personNames: {
          where: { deletedAt: null },
        },
      },
    });

    return this.toDomain(person);
  }

  async delete(id: PersonId, deletedByUserId: number): Promise<void> {
    await prisma.person.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedByUserId,
      },
    });
  }

  async addName(id: PersonId, name: string): Promise<void> {
    await prisma.personName.create({
      data: {
        personId: id,
        name,
      },
    });
  }

  async removeName(personNameId: number): Promise<void> {
    await prisma.personName.update({
      where: { id: personNameId },
      data: { deletedAt: new Date() },
    });
  }

  private toDomain(prismaModel: {
    id: number;
    bio: string | null;
    birthYear: number | null;
    deathYear: number | null;
    country: string | null;
    createdAt: Date;
    createdByUserId: number;
    personNames: { name: string }[];
  }): Person {
    return new Person(
      prismaModel.id,
      prismaModel.personNames.map((pn) => pn.name),
      prismaModel.bio,
      prismaModel.birthYear,
      prismaModel.deathYear,
      prismaModel.country,
      prismaModel.createdAt,
      prismaModel.createdByUserId
    );
  }
}
