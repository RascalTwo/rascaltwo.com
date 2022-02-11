
import fs from 'fs';
import path from 'path';
import YAML from 'yaml'
import { marked } from 'marked';
import hljs from 'highlight.js';
import { IS_PRODUCTION } from './helpers';
import type { Blog, Technologies, WorkData, WorkSource } from "./types";

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

export async function fetchBlogs(){
  const ROOT = path.join('src', 'data', 'blogs');

  const blogs: Blog[] = []
  for (const filename of fs.readdirSync(ROOT).sort((a, b) => b.localeCompare(a))){
    const absolutePath = path.join(ROOT, filename);
    if (!(await fs.promises.stat(absolutePath)).isFile()) continue;

    const content = (await fs.promises.readFile(absolutePath)).toString();

    let yaml: Record<string, any> = {};
    let rawMarkdown;
    const yamlMatch = content.match(/^---\n(.*?)\n---/ms);
    if (yamlMatch) {
      yaml = YAML.parse(yamlMatch[1])
      rawMarkdown = content.split(yamlMatch[0])[1].trim()
    }
    else {
      rawMarkdown = content
    }

    const markdown = rawMarkdown.replace(
        /```(\w*?) (.*?)```/gi,
        (_, lang, code) => {
          const language = hljs.getLanguage(lang) ? lang : 'plaintext';
          return `<code class="language-${lang} hljs">${hljs.highlight(code, { language }).value}</code>`
        });

    const html = marked(markdown, {
      highlight(code, lang){
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      }
    }).replace(/<code class="(language.*?)"/ig, (match, oldClass) => {
      return match.slice(0, -1) + ' hljs"';
    });

    const title = markdown.split('\n')[0].slice(1).trim();
    const excerpt = markdown.split('\n')[2];
    const slug = yaml.slug ?? title.toLowerCase().split(' ').join('-').replace('?', '').replace('.', '').replace('!', '');
    const date = filename.split('.')[0].split('-').map(Number) as [number, number, number]
    blogs.push({ slug, title, date, html, excerpt })
  }

  return blogs;
}