import { http,createConfig } from '@wagmi/core'
import { iotex } from '@wagmi/core/chains'
// import { iotex } from 'wagmi/chains'
// const projectId = 'e798cef35d6a24a5ddf135ca3b9d57d7';
export const config = createConfig({
  chains: [iotex],
  transports: {
    [iotex.id]: http(),
    // [iotexTestnet.id]: http(),
  },
})
