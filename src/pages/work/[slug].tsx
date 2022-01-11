import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { fetchWorkDataAndTechnologies } from '../../ssrHelpers';
import type { WorkData } from '../../types';
import { FullWorkItem } from '../../components/Work';

interface WorkProps {
  work: WorkData | null;
}
export default function Work({ work }: WorkProps) {
  const router = useRouter();
  useEffect(() => {
    if (!work) router.push('/#section-work');
  }, [router, work]);

  return work ? <FullWorkItem {...work} data-page="true" /> : null;
}

export async function getStaticPaths() {
  const { work } = await fetchWorkDataAndTechnologies();

  return {
    paths: work.map(({ slug }) => ({ params: { slug }})),
    fallback: true,
  };
}

export async function getStaticProps({ params: { slug }}) {
  if (!slug) return { props: {} };
  const { work } = await fetchWorkDataAndTechnologies();

  return { props: { work: work.find(w => w.slug === slug) ?? null } };
}
