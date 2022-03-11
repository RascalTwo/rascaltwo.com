import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { fetchWorkDataAndTechnologies } from '../../ssrHelpers';
import type { WorkData } from '../../types';
import { FullWorkItem } from '../../components/Work';
import Footer from '../../components/Footer';
import { useLocaleConfig } from '../../helpers';
import ThemeToggler from '../../components/ThemeToggler';

interface WorkProps {
  work: WorkData | null;
}
export default function Work({ work }: WorkProps) {
  const { name, links } = useLocaleConfig();
  const router = useRouter();
  useEffect(() => {
    if (!work) router.push('/#section-work');
  }, [router, work]);

  return work ? <>
    <ThemeToggler />
    <FullWorkItem {...work} data-page="true" />
    <Footer name={name} links={links} />
  </>: null;
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
