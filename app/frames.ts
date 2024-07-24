import {FrameButtonMetadata, FrameMetadataType} from "@coinbase/onchainkit/esm/frame";

function donateButton(patron: string) : FrameButtonMetadata {
  return {
    target: `${process.env.NEXT_PUBLIC_URL}/api/tx?patron=${patron}`,
    postUrl: `${process.env.NEXT_PUBLIC_URL}/api/frame?patron=${patron}`,
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

export function initialFrame(patron: string) : FrameMetadataType {
  return {
    buttons: [
      {
        ...donateButton(patron),
        label: `Tip ${priceFromIndex(1)}$`,
      },
      {
        ...donateButton(patron),
        label: `Tip ${priceFromIndex(2)}$`,
      },
      {
        ...donateButton(patron),
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
    postUrl: `${process.env.NEXT_PUBLIC_URL}/api/frame?patron=${patron}`,
    state: {}
  }
}

export function customDonationFrame(patron: string) : FrameMetadataType {
  return {
    input: {text: "Amount in $"},
    buttons: [
      {
        ...donateButton(patron),
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
    postUrl: `${process.env.NEXT_PUBLIC_URL}/api/frame?patron=${patron}`,
    state: {isCustom: true}
  }
}

export function transactionCallbackFrame(patron: string, txId: string) : FrameMetadataType {
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
    postUrl: `${process.env.NEXT_PUBLIC_URL}/api/frame?patron=${patron}`,
    state: {isTxCallback: true}
  }
}
