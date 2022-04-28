import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react'

function MyApp({ Component, pageProps }: AppProps) {
  // rinkeby is a testing network for eth
  //TODO: switch the rinkeby network here if you are going for the real deal
  return (
    <ThirdwebProvider desiredChainId={ChainId.Rinkeby}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  )
}

export default MyApp
