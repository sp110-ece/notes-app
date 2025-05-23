import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Amplify } from 'aws-amplify'
import { amplifyConfig } from '@/lib/amplifyConfig'

Amplify.configure(amplifyConfig);

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}





