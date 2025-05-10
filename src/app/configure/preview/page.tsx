import { db } from '@/db/prisma';
import { notFound } from 'next/navigation';
import DesignPreview from './DesignPreview';

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

async function PreviewStepPage({ searchParams }: PageProps) {
  const { id } = searchParams;

  if (!id || typeof id !== 'string') return notFound();

  const configuration = await db.configuration.findUnique({ where: { id } });

  if (configuration == null) return notFound();

  return <DesignPreview configuration={configuration} />;
}
export default PreviewStepPage;
