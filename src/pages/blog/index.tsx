import Head from 'next/head';
import Link from 'next/link';

import Footer from '../../components/Footer';
import { fetchBlogs } from '../../ssrHelpers';
import { useLocaleConfig } from '../../helpers';
import { Blog } from '../../types';

import styles from './index.module.css';

export default function BlogLanding({ blogs }: { blogs: Blog[] }) {
  const { name, links } = useLocaleConfig();
  return (
    <>
      <Head>
        <title>{name}&apos;s Blog</title>
      </Head>
      <header className={styles.header}>
        <h1>
          <Link href="/">{name}</Link>&apos;s Blog
        </h1>
      </header>
      <main className={styles.main}>
        {blogs.map(blog => (
          <section key={blog.slug} className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>
                <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
              </h2>
              <time dateTime={blog.date.map(String).join('-')}>
                {new Date(blog.date.map(String).join('-')).toDateString()}
              </time>
            </div>
            <p>{blog.excerpt}</p>
          </section>
        ))}
      </main>
      <Footer name={name} links={links} />
    </>
  );
}

export async function getStaticProps() {
  return { props: { blogs: await fetchBlogs() } };
}
