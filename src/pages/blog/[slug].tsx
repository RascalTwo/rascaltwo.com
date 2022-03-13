import Link from 'next/link';
import { fetchBlogs } from '../../ssrHelpers';
import { Blog } from '../../types';

import styles from './Blog.module.css';
import 'highlight.js/styles/github-dark-dimmed.css';
import Footer from '../../components/Footer';
import { useLocaleConfig } from '../../helpers';
import Head from 'next/head';
import ThemeToggler from '../../components/ThemeToggler';

export default function BlogEntry({ blog }: { blog: Blog | undefined }) {
  const { name, links } = useLocaleConfig();
  if (!blog) return null;
  return (
    <>
      <Head>
        <title>{name}&apos;s Software Development Blog - {blog.title}</title>
      </Head>
      <ThemeToggler />
      <header className={styles.header}>
        <Link href="/blog">Return to Blog Home</Link>
        <h2>
          <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
        </h2>
        {blog.urls.source ? <a href={blog.urls.source}>Source</a> : <span></span>}
        &nbsp;
        {blog.urls.live ? <a href={blog.urls.live}>Live</a> : <span></span>}
        <br/>
        <time dateTime={blog.date.map(String).join('-')}>
          {new Date(blog.date.map(String).join('-')).toDateString()}
        </time>
      </header>
      <article className={styles.article} dangerouslySetInnerHTML={{ __html: blog.html.replaceAll('I18N_NAME', name) }}></article>
      <Footer name={name} links={links} />
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: (await fetchBlogs()).map(({ slug }) => ({ params: { slug } })),
    fallback: true,
  };
}

export async function getStaticProps({ params: { slug } }) {
  return {
    props: {
      blog: (await fetchBlogs()).filter(blog => blog.slug === slug)[0] ?? null,
    },
  };
}
