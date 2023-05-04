import "~/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "@next/font/google";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], fallback: ["system-ui", "arial"] });

export const metadata = {
  title: "Mecab",
  description:
    "Mecab is a Japanese morphological analyzer. Use it to parse Japanese sentences into their different components.",
};

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`scrollbar scrollbar-thumb-slate-800 scrollbar-track-slate-900 dark h-full ${inter.className}`}
    >
      <body className="h-full">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
