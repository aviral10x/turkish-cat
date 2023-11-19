import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";

import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  Locale,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
  goerli,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { useRouter } from "next/router";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    goerli,
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [goerli] : []),
  ],
  [publicProvider()]
);

const projectId = "4693d02b88d3b23c6d072f0e071c86f5";

const { wallets } = getDefaultWallets({
  appName: "RainbowKit demo",
  projectId,
  chains,
});

const demoAppInfo = {
  appName: "Rainbowkit Demo",
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});


export default function App({ Component, pageProps }: AppProps) {
  const { locale } = useRouter() as { locale: Locale };
  return <WagmiConfig config={wagmiConfig}>
  <RainbowKitProvider appInfo={demoAppInfo} chains={chains} locale={locale}>
    <Component {...pageProps} />
  </RainbowKitProvider>
</WagmiConfig>;
}
