// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppProps, AppType } from "next/app";
import { dark } from "@clerk/themes";
import { ClerkProvider } from "@clerk/nextjs";
import { trpc } from "../utils/trpc";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { ptBR } from "@clerk/localizations";
export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
const MyApp: AppType = ({
  Component,
  pageProps: { ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  const layout = getLayout(<Component {...pageProps} />);
  return (
    <ClerkProvider
      localization={ptBR}
      {...pageProps}
      appearance={{
        baseTheme: dark,
        variables: {
          colorBackground: "#1F2937",
        },
      }}
    >
      {layout}
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);
