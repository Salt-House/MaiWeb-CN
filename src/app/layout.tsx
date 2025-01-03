import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import "./css/homepage.css"
import AnimatedComponent from "./components/AnimatedComponent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "maimai中国玩家站",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://chinese-fonts-cdn.deno.dev/packages/maple-mono-cn/dist/MapleMono-CN-SemiBold/result.css"
        />
      </Head>
      <body>
        <AnimatedComponent>
          {children}

        </AnimatedComponent>
      </body>
    </html>
  );
}
