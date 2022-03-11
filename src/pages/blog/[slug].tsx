import Link from 'next/link';
import { fetchBlogs } from '../../ssrHelpers';
import { Blog } from '../../types';

import styles from './Blog.module.css';
import 'highlight.js/styles/github-dark-dimmed.css';
import Footer from '../../components/Footer';
import { useLocaleConfig } from '../../helpers';
import Head from 'next/head';

export default function BlogEntry({ blog }: { blog: Blog | undefined }) {
  const { name, links } = useLocaleConfig();
  if (!blog) return null;
  return (
    <>
      <Head>
        <title>{name}&apos;s Blog - {blog.title}</title>
      </Head>
      <Link href="/blog">Return to Blog Home</Link>
      <header className={styles.header}>
        <h2>
          <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
        </h2>
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
