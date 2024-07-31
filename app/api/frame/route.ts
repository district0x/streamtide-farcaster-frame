import { FrameRequest, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { validateFramesMessage } from "@airstack/frames";
import { init } from "@airstack/frames";
import {customDonationFrame, initialFrame, transactionCallbackFrame} from "@/app/frames";
import {parseHex, parseState, parseText} from "@/app/utils";

init(process.env.AIRSTACK_API_KEY)

function sendError(message: string) {
  return NextResponse.json({message: message}, {status: 400});
}

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const searchParams = req.nextUrl.searchParams
  const creator = searchParams.get("creator");

  if (!creator)
    return sendError("Invalid creator address");

  const body: FrameRequest = await req.json();

  const response = await validateFramesMessage(body);
  const isValid = response.isValid

  if (!isValid || !response.message)
    return sendError("Invalid frame message");

  const frameActionBody = response.message.data.frameActionBody;
  const button = frameActionBody.buttonIndex;
  const state = parseState(frameActionBody.state)

  try {
    if (state.isCustom) {  // we are in the customDonation frame
      if (button == 2) {  // Clicked go back button
        return new NextResponse(getFrameHtmlResponse(initialFrame(creator)));
      }
    } else if (state.isTxCallback) { // we are in the tx callback frame
      if (button == 2) {  // Clicked restart button
        return new NextResponse(getFrameHtmlResponse(initialFrame(creator)));
      }
    } else { // we are in the initial frame
      if (button === 4) {  // clicked the Custom Donation button
        return new NextResponse(getFrameHtmlResponse(customDonationFrame(creator)));
      }
    }

    const transactionId = parseHex(frameActionBody.transactionId);
    if (transactionId) {
      return new NextResponse(getFrameHtmlResponse(transactionCallbackFrame(creator, transactionId)));
    }

    // if we get here, something unexpected happened
    return sendError("Frame message unexpected");

  } catch (e) {
    console.error(e);
    return sendError("Internal Server Error");
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';