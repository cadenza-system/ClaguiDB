'use client';
import { Card, CardContent, Typography, Box } from '@mui/material';
import NextLink from 'next/link';
import { Person } from '@/domain/person';

export interface PersonCardProps {
  person: Person;
  language: 'ja' | 'en';
}

export const PersonCard: React.FC<PersonCardProps> = ({ person, language }) => {
  const mainName = person.getMainName(language);
  const subName =
    language === 'ja'
      ? person.getEnglishMainName()
      : person.getJapaneseMainName();

  return (
    <Card
      component={NextLink}
      href={`/persons/${person.id}`}
      sx={{
        textDecoration: 'none',
        '&:hover': { boxShadow: 4 },
        transition: 'box-shadow 0.2s',
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold">
          {mainName}
        </Typography>
        {subName && (
          <Typography variant="body2" color="text.secondary">
            {subName}
          </Typography>
        )}
        <Box sx={{ mt: 1 }}>
          {person.birthYear && (
            <Typography variant="caption" color="text.secondary">
              {person.birthYear}
              {person.deathYear ? ` - ${person.deathYear}` : ' -'}
            </Typography>
          )}
          {person.country && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ ml: 1 }}
            >
              {person.country}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
