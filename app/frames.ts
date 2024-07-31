import {FrameButtonMetadata, FrameMetadataType} from "@coinbase/onchainkit/esm/frame";

function donateButton(creator: string) : FrameButtonMetadata {
  return {
    target: `${process.env.NEXT_PUBLIC_URL}/api/tx?creator=${creator}`,
    postUrl: `${process.env.NEXT_PUBLIC_URL}/api/frame?creator=${creator}`,
    action: "tx",
    label: 'donate',
  }
}

const BUTTON_PRICES = {
  button_1: 10,
  button_2: 25,
  button_3: 50
}

export function priceFromIndex(index: 1|2|3): number {
  return BUTTON_PRICES[`button_${index}`];
}

export function initialFrame(creator: string) : FrameMetadataType {
  return {
    buttons: [
      {
        ...donateButton(creator),
        label: `Tip ${priceFromIndex(1)}$`,
      },
      {
        ...donateButton(creator),
        label: `Tip ${priceFromIndex(2)}$`,
      },
      {
        ...donateButton(creator),
        label: `Tip ${priceFromIndex(3)}$`,
      },
      {
        label: 'Custom tip',
      }
    ],
    image: {
      src: `${process.env.NEXT_PUBLIC_URL}/streamtide-farcaster.png`,
      aspectRatio: "1:1"
    },
    postUrl: `${process.env.NEXT_PUBLIC_URL}/api/frame?creator=${creator}`,
    state: {}
  }
}

export function customDonationFrame(creator: string) : FrameMetadataType {
  return {
    input: {text: "Amount in $"},
    buttons: [
      {
        ...donateButton(creator),
        label: 'Tip',
      },
      {
        label: '< Go back'
      }
    ],
    image: {
      src: `${process.env.NEXT_PUBLIC_URL}/streamtide-farcaster.png`,
      aspectRatio: "1:1"
    },
    postUrl: `${process.env.NEXT_PUBLIC_URL}/api/frame?creator=${creator}`,
    state: {isCustom: true}
  }
}

export function transactionCallbackFrame(creator: string, txId: string) : FrameMetadataType {
  return {
    buttons: [
      {
        action: "link",
        target: `${process.env.ETHERSCAN_TX_URL}/${txId}`,
        label: 'See transaction status'
      },
      {
        label: '< Restart'
      }
    ],
    image: {
      src: `${process.env.NEXT_PUBLIC_URL}/streamtide-farcaster.png`,
      aspectRatio: "1:1"
    },
    postUrl: `${process.env.NEXT_PUBLIC_URL}/api/frame?creator=${creator}`,
    state: {isTxCallback: true}
  }
}
