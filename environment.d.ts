declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_URL: string,
      AIRSTACK_API_KEY: string,
      ETHERSCAN_API_KEY: string
      ST_CONTRACT_ADDRESS: string,
      NETWORK_ID: number
    }
  }
}

export {}
