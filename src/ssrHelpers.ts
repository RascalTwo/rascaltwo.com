
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
  const seenTech = new Set<string>();

  try{
    const rawYAML = await fetchStaticResource('https://raw.githubusercontent.com/RascalTwo/RascalTwo/main/data/projects.yaml', 'projects');
    work = Object.entries(YAML.parse(rawYAML)).map(([slug, data]: [string, WorkData]) => {
      data.slug = slug;
      if (!('urls' in data)) data.urls = {};
      if (!data.urls.source) data.urls.source = sourceToURL(data.source);
      for (const key of ['technologies', 'concepts']){
        data.tags[key] = data.tags[key].split(' ').map(slug => {
          const tech = allTechnologies[slug]
          if (tech) seenTech.add(slug)
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

  for (const [catSlug, category] of Object.entries(technologies)){
    for (const slug in category){
      if (!seenTech.has(slug)) delete category[slug]
    }
    if (!Object.keys(category).length) delete technologies[catSlug];
  }

	return { work, technologies }
}

interface MatchWithIndices extends RegExpMatchArray {
  indices: [number, number][]
}

interface R2Match {
  regex: string
  match: MatchWithIndices
}

function indexChanges(content: string, regexes: string[]): R2Match[]{
  return regexes.reduce((indexes, regex) => {
    const matches = Array.from(content.matchAll(new RegExp(regex, 'gd')));
    if (!matches.length) return indexes;
    for (const match of matches) indexes.push({ regex, match });
    return indexes;
  }, [])
}

function filterNestedMatches(matches: R2Match[]): R2Match[]{
  const good = [];
  for (const match of matches){
    let nested = false;
    for (const possibleNestor of matches){
      if (match.regex === possibleNestor.regex) continue;
      if (match.match.indices[0][0] >= possibleNestor.match.indices[0][0] && match.match.indices[0][1] <= possibleNestor.match.indices[0][1]) {
        nested = true;
        break
      }
    }
    if (!nested) good.push(match)
  }
  return good
}

function performReplacements(content: string, matches: R2Match[], infos: ReplaceInfo[]){
  const infoMap = infos.reduce<Record<string, ReplaceInfo>>((obj, info) => ({ ...obj, [info.regex]: info }), {})
  for (const match of matches){
    const info = infoMap[match.regex]!
    const strings = { ...info }
    for (const key of ['url', 'newContent', 'title']){
      let string = strings[key]
      if (!string) string = key === 'newContent' ? info.type === 'abbreviations' ? '$1' : '$0' : ''

      for (let i = 0; i < match.match.indices.length; i++){
        string = string.replaceAll(`$${i}`, content.substring(...match.match.indices[i]))
      }

      strings[key] = string;
    }
    let replacement = '';
    switch(info.type){
      case 'raw': {
        replacement = strings.newContent
        break
      }
      case 'links': {
        replacement = `<a href="${strings.url}"`
        if (strings.title) replacement += ` title="${strings.title}" aria-label="${strings.title}"`
        replacement += `>${strings.newContent}</a>`
        break;
      }
      case 'abbreviations': {
        replacement = ` <abbr title="${strings.title}">`;
        if (strings.url) replacement += `<a href="${strings.url}">`;
        replacement += strings.newContent;
        if (strings.url) replacement += '</a>';
        replacement += '</abbr>';
        break;
      }
    }
    content = content.substring(0, match.match.indices[0][0]) + replacement + content.substring(match.match.indices[0][1])
  }
  return content;
}

interface ReplaceInfo {
  regex: string
  type: string
  newContent?: string
  title?: string
  url?: string
}

export async function fetchBlogs(){
  const ROOT = path.join('src', 'data', 'blogs');

  const regexes = (await Promise.all(['abbreviations', 'links', 'raw'].map(async (type): Promise<ReplaceInfo[]>  => {
    const absolute = path.join(ROOT, type + '.yaml')
    if (!fs.existsSync(absolute)) return [];

    const data = (await fs.promises.readFile(absolute)).toString();
    const yaml: Record<string, string[]> = YAML.parse(data) ?? {}

    let remap = (regex: string, args: string[]): Partial<ReplaceInfo> & { regex: string } => ({ regex: '' })
    switch (type){
      case 'abbreviations':
        remap = (regex, [title, url, newContent]) => ({ regex: ' (' + regex + ')', title, url, newContent })
        break;
      case 'links':
        remap = (regex, [url, title, newContent]) => ({ regex, title, url, newContent })
        break;
      case 'raw':
        remap = (regex, [newContent]) => ({ regex, newContent })
        break;
    }

    return Object.entries(yaml).map(([regex, ...args]) => ({ type, ...remap(regex, ...args) }));
  }))).flat()

  const blogs: Blog[] = []
  for (const filename of fs.readdirSync(ROOT).sort((a, b) => b.localeCompare(a))){
    const absolutePath = path.join(ROOT, filename);
    if (!filename.endsWith('md') || !(await fs.promises.stat(absolutePath)).isFile()) continue;

    const content = (await fs.promises.readFile(absolutePath)).toString();

    let yaml: Record<string, any> = {};
    let rawMarkdown;
    const yamlMatch = content.match(/^---\n(.*?)\n---/ms);
    if (yamlMatch) {
      yaml = YAML.parse(yamlMatch[1]);
      rawMarkdown = content.split(yamlMatch[0])[1].trim();
    } else {
      rawMarkdown = content;
    }

    const allRegexes = [
      ...regexes,
      ...(yaml.replacements
        ? Object.entries(yaml.replacements).map<ReplaceInfo>(([regex, newContent]: [string, string]) => ({
            type: 'raw',
            regex,
            newContent,
          }))
        : []),
    ];

    let titlelessMarkdown = rawMarkdown.split('\n').slice(1).join('\n')
    const matches = indexChanges(titlelessMarkdown, allRegexes.map(r => r.regex))
    const goodMatches = filterNestedMatches(matches);
    goodMatches.sort((a, b) => b.match.index - a.match.index);
    titlelessMarkdown = performReplacements(titlelessMarkdown, goodMatches, allRegexes)
    rawMarkdown = rawMarkdown.split('\n')[0] + '\n' + titlelessMarkdown

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
    const slug = yaml.slug ?? title.toLowerCase().split(' ').join('-').replace('?', '').replace('.', '').replace('!', '').replace('#', '');
    const date = filename.split('.')[0].split('-').map(Number) as [number, number, number]
    blogs.push({ slug, title, date, html, excerpt })
  }

  return blogs;
}