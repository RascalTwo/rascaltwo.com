import Link from 'next/link';
import { fetchBlogs } from '../../ssrHelpers';
import { Blog } from '../../types';

import styles from './Blog.module.css';
import 'highlight.js/styles/github-dark-dimmed.css';
import Footer from '../../components/Footer';
import { useLocaleConfig } from '../../helpers';
import Head from 'next/head';
import ThemeToggler from '../../components/ThemeToggler';
import TagsContainer from '../../components/TagsContainer';

export default function BlogEntry({ blog }: { blog: Blog | undefined }) {
  const { name, website, links, short } = useLocaleConfig();
  if (!blog) return null;

  const absoluteURL = website + '/blog/' + blog.slug;
  const embedAbsoluteURL = `${website}/embeds/blog/${blog.slug}.jpg`;

  return (
    <>
      <Head>
        <title>{name}&apos;s Software Development Blog - {blog.title}</title>

        <link rel="canonical" href={absoluteURL} />
        <link rel="shortlink" href={`${website + '/b/' + blog.slug}`} />

        <meta name="description" content={blog.excerpt} />
        <meta property="og:type" content="website" />
        <meta property="og:og:site_name" content={name} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        <meta property="og:url" content={absoluteURL} />
        <meta name="image" property="og:image" content={embedAbsoluteURL} />
        <meta property="og:image:secure_url" content={embedAbsoluteURL} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:domain" content={website.split('//')[1]} />
        <meta name="twitter:title" content={name} />
        <meta name="twitter:description" content={blog.excerpt} />
        <meta name="twitter:image" content={embedAbsoluteURL} />
        <meta name="twitter:site" content="@RealRascalTwo" />
        <meta name="twitter:creator" content="@RealRascalTwo" />
        {blog.urls.live ? (
          <>
            <meta name="twitter:label1" content="Live" />
            <meta name="twitter:data1" content={blog.urls.live} />
          </>
        ) : null}
        {blog.urls.live ? (
          <>
            <meta name="twitter:label2" content="Source" />
            <meta name="twitter:data2" content={blog.urls.source} />
          </>
        ) : null}

        <link rel="alternate" type="application/json+oembed" href={`${website}/embeds/blog/${blog.slug}-oembed-${short}.json`} />
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
        <TagsContainer tags={blog.tags} />
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
  const blog = (await fetchBlogs()).filter(blog => blog.slug === slug)[0];
  return blog ? {
    props: { blog },
  } : {
    redirect: {
      destination: '/blog/',
      permanent: false,
    },
  }
}
