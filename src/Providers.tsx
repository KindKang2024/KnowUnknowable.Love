// Providers.tsx
import {ReactNode} from "react";
import {SelectedPlanetProvider} from "./contexts/SelectedPlanetContext";
import {SpeedControlProvider} from "./contexts/SpeedControlContext";
import {PlanetPositionsProvider} from "./contexts/PlanetPositionsContext";
import {CameraProvider} from "./contexts/CameraContext";
import {PlayProvider} from "./hooks/use-play";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {DataProvider} from "./i18n/DataProvider";
import {TooltipProvider} from "@radix-ui/react-tooltip";

import {Buffer} from 'buffer'
import './index.css';
import '@rainbow-me/rainbowkit/styles.css';
import {WagmiProvider} from 'wagmi'
import {darkTheme, Locale, RainbowKitProvider} from '@rainbow-me/rainbowkit';
import {config} from "./wagmi.ts";
import {AuthProvider} from './AuthProvider.tsx';
import {useTranslation} from "react-i18next";

globalThis.Buffer = Buffer

const queryClient = new QueryClient()

export default function Providers({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RainbowKitProvider
              locale={i18n.language as Locale}
              // theme={darkTheme({
              //   accentColor: '#7b3fe4',
              //   accentColorForeground: 'white',
              //   borderRadius: 'small',
              //   fontStack: 'system',
              //   overlayBlur: 'small',
              // })}
              theme={darkTheme()}
            >
              <DataProvider>
                <TooltipProvider>
                  <PlayProvider>
                    <SelectedPlanetProvider>
                      <SpeedControlProvider>
                        <PlanetPositionsProvider>
                          <CameraProvider>{children}</CameraProvider>
                        </PlanetPositionsProvider>
                      </SpeedControlProvider>
                    </SelectedPlanetProvider>

                  </PlayProvider>
                </TooltipProvider>
              </DataProvider>
            </RainbowKitProvider>
          </AuthProvider>
        </QueryClientProvider>
      </WagmiProvider >
    </>
  );
}
