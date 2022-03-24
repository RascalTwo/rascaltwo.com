import Head from 'next/head';
import { useLocaleConfig } from '../../../helpers';

export default function DiscordBlogLanding() {
  const { meta, website, short } = useLocaleConfig();
  return (
    <Head>
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content="Where I talk about my software development journey!" />
      <meta property="og:image" content={`${website}/embeds/embed-image.gif`} />
      <meta name="twitter:card" content="summary_large_image"></meta>
      <link type="application/json+oembed" href={`${website}/embeds/oembed-${short}.json`} />
    </Head>
  );
}
