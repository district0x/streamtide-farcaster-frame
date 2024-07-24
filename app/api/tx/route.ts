import {NextRequest, NextResponse} from "next/server";
import {init, validateFramesMessage} from "@airstack/frames";
import {priceFromIndex} from "@/app/frames";
import {parseState, parseText} from "@/app/utils";
import { Contract } from 'web3-eth-contract';
import {toWei} from "web3-utils";

const abi = [
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "patronAddresses",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "name": "donate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  }
]

init(process.env.AIRSTACK_API_KEY)


async function getResponse(req: NextRequest): Promise<NextResponse> {
  const searchParams = req.nextUrl.searchParams
  const patron = searchParams.get("patron");

  if (!patron)
    return NextResponse.next({status: 400});

  const body = await req.json();
  const response = await validateFramesMessage(body);

  if (!response.isValid || !response.message)
    return NextResponse.next({status: 400});

  const frameActionBody = response.message.data.frameActionBody

  const {buttonIndex, inputText} = frameActionBody;
  const state = parseState(frameActionBody.state);

  let amount;
  if (state.isCustom) {
    const input = parseText(inputText)
    if (input == undefined)
      return NextResponse.next({status: 400});
    amount = parseInt(input);
    if (isNaN(amount))
      return NextResponse.next({status: 400});
  } else {
    amount = priceFromIndex(buttonIndex as 1|2|3)
  }

  const ethPriceResponse = await fetch(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.ETHERSCAN_API_KEY}`);
  const ethPrice = (await ethPriceResponse.json()).result.ethusd;
  const value = toWei(amount / parseFloat(ethPrice), "ether" );

  const contract = new Contract(abi);
  const calldata = contract.methods.donate([patron], [value]).encodeABI();

  return NextResponse.json({
    chainId: `eip155:${process.env.NETWORK_ID}`,
    method: "eth_sendTransaction",
    params: {
      abi: abi,
      to: process.env.ST_CONTRACT_ADDRESS,
      value: value,
      data: calldata
    }
  });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';