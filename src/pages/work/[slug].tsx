import { useRouter } from 'next/router';
import { IS_PRODUCTION } from '../../helpers';
import YAML from 'yaml';
import fs from 'fs';
import type { Technologies, WorkData, WorkSource } from '../../types';
import { FullWorkItem } from '../../components/Work';
import { useEffect, useMemo } from 'react';

interface WorkProps {
  technologies: Technologies;
  work: WorkData[];
}
export default function Work({ work }: WorkProps) {
  const router = useRouter();
  const { slug } = router.query;
  const workItem = useMemo(() => work?.find(w => w.slug === slug), [slug, work]);
  useEffect(() => {
    if (work && !workItem) router.push('/#section-work');
  }, [router, work, workItem]);

  return workItem ? <FullWorkItem {...workItem} data-page="true" /> : null;
}

const sourceToURL = ({ repo, gist }: WorkSource) => {
  if (repo) return 'https://github.com/RascalTwo/' + repo;
  if (gist) return 'https://gist.github.com/RascalTwo/' + gist;
  throw new Error('Source must have at least one value');
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps() {
  if (!IS_PRODUCTION && fs.existsSync('./src/data/cachedStaticProps.json')) {
    return { props: JSON.parse((await fs.promises.readFile('./src/data/cachedStaticProps.json')).toString()) };
  }
  let technologies: Technologies = {};

  try {
    const response = await fetch('https://raw.githubusercontent.com/RascalTwo/RascalTwo/main/data/technologies.yaml');
    const rawYAML = await response.text();
    technologies = YAML.parse(rawYAML);
  } catch (e) {
    console.error('Unable to fetch technologies:', e);
  }

  let work: WorkData[] = [];
  const allTechnologies = Object.values(technologies).reduce((all, mapping) => ({ ...all, ...mapping }), {});

  try {
    const response = await fetch('https://raw.githubusercontent.com/RascalTwo/RascalTwo/main/data/projects.yaml');
    const rawYAML = await response.text();
    work = Object.entries(YAML.parse(rawYAML)).map(([slug, data]: [string, WorkData]) => {
      data.slug = slug;
      if (!('urls' in data)) data.urls = {};
      if (!data.urls.source) data.urls.source = sourceToURL(data.source);
      for (const key of ['technologies', 'concepts']) {
        data.tags[key] = data.tags[key]
          .split(' ')
          .map(slug => {
            const tech = allTechnologies[slug];
            return [tech ?? null, slug];
          })
          .reduce((obj, [tech, slug]) => ({ ...obj, [slug]: tech }), {});
      }
      return data;
    });
    if (fs.existsSync('./src/data/order.json')) {
      const order = JSON.parse((await fs.promises.readFile('./src/data/order.json')).toString());
      work.sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
    }
  } catch (e) {
    console.error('Unable to fetch work:', e);
  }

  if (!IS_PRODUCTION)
    await fs.promises.writeFile('./src/data/cachedStaticProps.json', JSON.stringify({ technologies, work }));

  return { props: { technologies, work } };
}
