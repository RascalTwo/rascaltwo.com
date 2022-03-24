import Head from 'next/head';
import Link from 'next/link';

import Footer from '../../components/Footer';
import { fetchBlogs } from '../../ssrHelpers';
import { useLocaleConfig } from '../../helpers';
import { BlogMeta } from '../../types';

import styles from './index.module.css';
import ThemeToggler from '../../components/ThemeToggler';

export default function BlogLanding({ blogs }: { blogs: BlogMeta[] }) {
  const { name, links, meta, website, short } = useLocaleConfig();
  return (
    <>
      <Head>
        <title>{name}&apos;s Software Development Blog</title>
        <meta name="description" content="Where I talk about my software development journey!" />
        <meta property="og:type" content="website"/>
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content="Where I talk about my software development journey!"/>
        <meta property="og:url" content={website}/>
        <meta name="image" property="og:image" content={`${website}/embeds/embed-image.gif`}/>
        <meta property="og:image:secure_url" content={`${website}/embeds/embed-image.gif`}/>

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:domain" content={website.split('//')[1]} />
        <meta name="twitter:title" content={name}/>
        <meta name="twitter:description" content="Where I talk about my software development journey!" />
        <meta name="twitter:image" content={`${website}/embeds/embed-twitter.jpg`}/>
        <meta name="twitter:site" content="@RealRascalTwo" />
        <meta name="twitter:creator" content="@RealRascalTwo" />

        <link rel="alternate" type="application/json+oembed" href={`${website}/embeds/oembed-${short}.json`} />
      </Head>
      <ThemeToggler />
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
  const blogs = await fetchBlogs();
  return {
    props: {
      blogs: blogs.map(blog => {
        const { html, ...meta } = blog;
        return meta;
      }),
    },
  };
}
