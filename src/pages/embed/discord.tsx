import Head from 'next/head';
import { useLocaleConfig } from '../../helpers';

export default function DiscordEmbed() {
  const { meta, website } = useLocaleConfig();
  // Discord uses the twitter image first, so here is a page just for discord to generate it's embed from
  return (
    <Head>
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={`${website}/embed-image.gif`} />
      <meta name="twitter:card" content="summary_large_image"></meta>
      <link type="application/json+oembed" href={`${website}/${meta.oembedFilename}`} />
    </Head>
  );
}
