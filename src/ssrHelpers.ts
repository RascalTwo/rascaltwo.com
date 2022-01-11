
import fs from 'fs';
import path from 'path';
import YAML from 'yaml'
import { IS_PRODUCTION } from './helpers';
import { Technologies, WorkData, WorkSource } from "./types";

export function fetchStaticResource(url: string, name: string){
	const cachePath = path.join('.', 'src', 'data', name + '.response');
	if (!IS_PRODUCTION && fs.existsSync(cachePath)) return fs.promises.readFile(cachePath).then(b => b.toString());

	return fetch(url).then(r => r.text()).then(async content => {
		if (!IS_PRODUCTION) await fs.promises.writeFile(cachePath, content)
		return content
	})
}

const sourceToURL = ({ repo, gist }: WorkSource) => {
	if (repo) return 'https://github.com/RascalTwo/' + repo;
	if (gist) return 'https://gist.github.com/RascalTwo/' + gist;
	throw new Error('Source must have at least one value');
}

export async function fetchWorkDataAndTechnologies(){
	let technologies: Technologies = {};

  try{
    const rawYAML = await fetchStaticResource('https://raw.githubusercontent.com/RascalTwo/RascalTwo/main/data/technologies.yaml', 'technologies');
    technologies = YAML.parse(rawYAML)
  }
  catch(e){
    console.error('Unable to fetch technologies:', e);
  }

  let work: WorkData[] = []
  const allTechnologies = Object.values(technologies).reduce((all, mapping) => ({ ...all, ...mapping }), {})

  try{
    const rawYAML = await fetchStaticResource('https://raw.githubusercontent.com/RascalTwo/RascalTwo/main/data/projects.yaml', 'projects');
    work = Object.entries(YAML.parse(rawYAML)).map(([slug, data]: [string, WorkData]) => {
      data.slug = slug;
      if (!('urls' in data)) data.urls = {};
      if (!data.urls.source) data.urls.source = sourceToURL(data.source);
      for (const key of ['technologies', 'concepts']){
        data.tags[key] = data.tags[key].split(' ').map(slug => {
          const tech = allTechnologies[slug]
          return [tech ?? null, slug]
        }).reduce((obj, [tech, slug]) => ({ ...obj, [slug]: tech }), {})
      }
      return data;
    });
    if (fs.existsSync('./src/data/order.json')){
      const order = JSON.parse((await fs.promises.readFile('./src/data/order.json')).toString());
      work.sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
    }
  }
  catch(e){
    console.error('Unable to fetch work:', e);
  }

	return { work, technologies }
}