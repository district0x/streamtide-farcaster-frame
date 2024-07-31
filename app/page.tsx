import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {initialFrame} from "@/app/frames";

const title = 'Streamtide Farcaster Frame';
const description = 'StreamTide is an open-source patronage tool that operates on Web3 and microgrants. This frame allows to make donations directly from any farcaster app';

const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL),
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description,
    images: [`${process.env.NEXT_PUBLIC_URL}/streamtide-farcaster.png`],
  }
}

export async function generateMetadata(
  { searchParams }: { searchParams: { [key: string]: string | string[] | undefined } } ): Promise<Metadata> {

  const creator = searchParams["creator"];
  if (creator === undefined || Array.isArray(creator)) {
    // if creator parameter is missing, we send a 404 error
    notFound();
  }

  return {
    ...metadata,
    other: {
      ...getFrameMetadata(initialFrame(creator)),
    },
  }
}

export default function Page() {
  return (
    <>
      <h1>Streamtide Farcaster Frame</h1>
    </>
  );
}
