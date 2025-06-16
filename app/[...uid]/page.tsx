import _ from 'lodash';
import { Metadata } from 'next';
import Head from 'next/head';
import { Fragment, Suspense } from 'react';

import ClientWrapper from '@/components/grid-systems/ClientWrapGridSystem';

import { fetchMetadata } from '../actions/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Params = { uid: string[] };
const handleParam = ({ uid }: { uid: string[] }) => {
  return { uid: uid[0], param: uid.slice(1) };
};
export default async function Page({ params }: { params: Params }) {
  const paramsProp = await params;
  const uidParse = handleParam(paramsProp);
  const metadata = await fetchMetadata(uidParse.uid);
  const formMetadata = _.get(metadata, 'data.form');
  const iconUrl = _.get(formMetadata, 'icon.icon') || '/favicon.ico';

  try {
    return (
      <Suspense>
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
        </Head>
        <Fragment>
          <ClientWrapper layoutId={uidParse.uid} pathName={uidParse.uid} />
        </Fragment>
      </Suspense>
    );
  } catch (error) {
    console.error('Page render error:', error);
    throw new Error('Failed to load page');
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const paramProps = await params;
  const { uid } = handleParam(paramProps);
  console.log('🚀 ~ generateMetadata ~ uid:', uid);
  const metadata = await fetchMetadata(uid);
  const formMetadata = _.get(metadata, 'data.form');

  if (!formMetadata) {
    return {
      title: uid,
      description: uid,
    };
  }
  const iconConfig = {
    icon: _.get(formMetadata, 'icon.icon'),
    shortcut: _.get(formMetadata, 'icon.shortcut'),
    apple: _.get(formMetadata, 'icon.apple'),
  };

  return {
    title: {
      default: formMetadata?.title?.default || 'DYNAMIC PAGE',
      template: formMetadata?.title.template,
    },
    description: formMetadata?.description || 'Default dynamic page.',
    keywords: formMetadata?.keywords,
    authors: formMetadata?.authors?.map((author: any) => ({
      name: author.name,
      url: author.url,
    })),
    openGraph: {
      title: formMetadata?.openGraph?.title || 'DYNAMIC PAGE',
      description: formMetadata?.openGraph?.description || 'Default dynamic page.',
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
