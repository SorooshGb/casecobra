import { db } from '@/db/prisma';
import { notFound } from 'next/navigation';
import DesignConfigurator from './DesignConfigurator';

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

async function DesignStepPage({ searchParams }: PageProps) {
  const { id } = searchParams;
  if (!id || typeof id !== 'string') return notFound();

  const configuration = await db.configuration.findUnique({ where: { id } });
  if (configuration == null) return notFound();
  const { imgUrl, width, height } = configuration;

  return (
    <DesignConfigurator
      configId={configuration.id}
      imageUrl={imgUrl}
      imageDimensions={{ width, height }}
    />
  );
}
export default DesignStepPage;
