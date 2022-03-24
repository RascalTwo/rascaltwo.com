import styles from './BlogImage.module.css';
import { useLocaleConfig } from '../../../helpers';
import { Blog } from '../../../types';
import { fetchBlogs } from '../../../ssrHelpers';
import { useMemo } from 'react';

export default function BlogImage({ blog }: { blog: Blog | undefined }) {
  const { name, website } = useLocaleConfig();
  const dateString = useMemo(() => {
    if (!blog) return '';

    const date = new Date(blog.date.map(String).join('-'));
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  }, [blog]);

  if (!blog) return null;

  return (
    <main className={styles.main}>
      <h1>
        {name}&apos;s Blog
        <div>{website.split('/').at(-1)}</div>
      </h1>

      <span></span>
      <h2>{blog.title}</h2>
      <p>{blog.excerpt}</p>
      <time dateTime={blog.date.map(String).join('-')}>{dateString}</time>
    </main>
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
