import { http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import { createConfig } from 'wagmi';

export function getConfig() {
  return createConfig({
    chains: [baseSepolia],
    connectors: [
      coinbaseWallet({
        appName: 'BaseBulletin',
        chainId: 84532,
      }),
    ],
    transports: {
      [baseSepolia.id]: http('https://sepolia.base.org'),
    },
  });
} 