import { MainLayout } from '@/components/templates/MainLayout';
import { PersonSearchClient } from './PersonSearchClient';

export default function PersonSearchPage() {
  return (
    <MainLayout>
      <PersonSearchClient />
    </MainLayout>
  );
}
