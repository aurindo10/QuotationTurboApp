// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppProps, AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { trpc } from "../utils/trpc";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
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
  return <ClerkProvider {...pageProps}>{layout}</ClerkProvider>;
};

export default trpc.withTRPC(MyApp);
