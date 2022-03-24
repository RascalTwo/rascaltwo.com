import Head from 'next/head';
import { useLocaleConfig } from '../../../../helpers';
import { Blog } from '../../../../types';
import { fetchBlogs } from '../../../../ssrHelpers';

export default function DiscordBlog({ blog }: { blog: Blog | undefined }) {
  const { name, website, short } = useLocaleConfig();

  if (!blog) return null;

  const embedAbsoluteURL = `${website}/embeds/blog/${blog.slug}.jpg`;
  return (
		<Head>
			<title>{name}&apos;s Software Development Blog - {blog.title}</title>

      <meta property="og:title" content={blog.title} />
      <meta property="og:description" content={blog.excerpt} />
      <meta property="og:image" content={embedAbsoluteURL} />
      <meta name="twitter:card" content="summary_large_image"></meta>
      <link type="application/json+oembed" href={`${website}/embeds/blog/${blog.slug}-oembed-${short}.json`} />
		</Head>
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
