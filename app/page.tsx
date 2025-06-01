import { Fragment } from 'react';
import { Metadata } from 'next';
import _ from 'lodash';
import Head from 'next/head';

import ClientWrapper from '@/components/grid-systems/ClientWrapGridSystem';
import { fetchMetadata } from './actions/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
const pageName = 'home';

export default async function Home() {
  const layoutId = pageName;
  const metadata = await fetchMetadata(pageName);
  const formMetadata = _.get(metadata, 'data.form');
  const iconUrl = _.get(formMetadata, 'icon.icon') || '/favicon.ico';

  return (
    <>
      <Head>
        <link rel="icon" href={iconUrl} type="image/png" />
        <link rel="preload" href={iconUrl} as="image" />
        <link
          rel="apple-touch-icon"
          href={_.get(formMetadata, 'icon.apple') || '/apple-icon.png'}
        />
        <link
          rel="shortcut icon"
          href={_.get(formMetadata, 'icon.shortcut') || '/shortcut-icon.png'}
        />
        <meta
          name="robots"
          content={[
            formMetadata?.robots?.follow ? 'follow' : 'nofollow',
            formMetadata?.robots?.index ? 'index' : 'noindex',
            `max-snippet:${formMetadata?.robots?.maxSnippet ?? -1}`,
            `max-video-preview:${formMetadata?.robots?.maxVideoPreview ?? -1}`,
            `max-image-preview:${formMetadata?.robots?.maxImagePreview ?? 'large'}`,
          ].join(', ')}
        />
        {formMetadata?.twitter?.label1 && (
          <>
            <meta name="twitter:label1" content={formMetadata?.twitter?.label1} />
            <meta name="twitter:data1" content={formMetadata?.twitter?.data1} />
          </>
        )}
        {formMetadata?.twitter?.label2 && (
          <>
            <meta name="twitter:label2" content={formMetadata?.twitter?.label2} />
            <meta name="twitter:data2" content={formMetadata?.twitter?.data2} />
          </>
        )}
      </Head>
      <Fragment>
        <ClientWrapper layoutId={layoutId} pathName={pageName} />
      </Fragment>
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const path = 'home';

  const metadata = await fetchMetadata(path);
  const formMetadata = _.get(metadata, 'data.form');

  if (!formMetadata) {
    return {
      title: 'Home',
      description: 'Home',
    };
  }
  const iconConfig = {
    icon: _.get(formMetadata, 'icon.icon'),
    shortcut: _.get(formMetadata, 'icon.shortcut'),
    apple: _.get(formMetadata, 'icon.apple'),
  };

  return {
    title: {
      default: formMetadata?.title?.default || 'HOME PAGE',
      template: formMetadata?.title.template,
    },
    description: formMetadata?.description || 'Default home page.',
    keywords: formMetadata?.keywords,
    authors: formMetadata?.authors?.map((author: any) => ({
      name: author.name,
      url: author.url,
    })),
    openGraph: {
      title: formMetadata?.openGraph?.title || 'HOME PAGE',
      description: formMetadata?.openGraph?.description || 'Default home page.',
      url: formMetadata?.openGraph?.url,
      siteName: formMetadata?.openGraph?.siteName,
      images: formMetadata?.openGraph?.images?.map((image: any) => ({
        url: image?.url,
        width: image?.width,
        height: image?.height,
        alt: image?.alt,
        secureUrl: image?.secure_url,
        type: image?.type || 'image/jpeg',
      })),
      locale: formMetadata?.openGraph?.locale || 'en_US',
      type: formMetadata?.openGraph?.type || 'website',
      modifiedTime: formMetadata?.openGraph?.updated_time,
    },
    twitter: {
      card: formMetadata?.twitter?.card || 'summary',
      title: formMetadata?.twitter?.title,
      description: formMetadata?.twitter?.description,
      images: formMetadata?.twitter?.images,
    },
    robots: {
      index: formMetadata?.robots?.index,
      follow: formMetadata?.robots?.follow,
      nocache: formMetadata?.robots?.nocache,
      'max-snippet': formMetadata?.robots?.maxSnippet,
      'max-video-preview': formMetadata?.robots?.maxVideoPreview,
      'max-image-preview': formMetadata?.robots?.maxImagePreview,
      googleBot: formMetadata?.robots?.googleBot
        ? {
            index: formMetadata?.robots?.googleBot?.index,
            follow: formMetadata?.robots?.googleBot?.follow,
            noimageindex: formMetadata?.robots?.googleBot?.noimageindex,
          }
        : undefined,
    },
    icons: {
      icon: iconConfig.icon || undefined,
      shortcut: iconConfig.shortcut || undefined,
      apple: iconConfig.apple || undefined,
    },
    alternates: {
      canonical: formMetadata?.alternates?.canonical || undefined,
    },
  };
}
