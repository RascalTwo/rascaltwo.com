import Head from 'next/head';
import Link from 'next/link';

import Footer from '../../components/Footer';
import { fetchBlogs } from '../../ssrHelpers';
import { Blog } from '../../types';

import styles from './index.module.css';

export default function BlogLanding({ blogs }: { blogs: Blog[] }) {
  return (
    <>
      <Head>
        <title>Joseph Milliken&apos;s Blog</title>
      </Head>
      <header className={styles.header}>
        <h1>
          <Link href="/">Joseph Milliken</Link>&apos;s Blog
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
      <Footer />
    </>
  );
}

export async function getStaticProps() {
  return { props: { blogs: await fetchBlogs() } };
}
