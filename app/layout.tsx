import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NameSentry - Check Project Name Availability',
  description: 'Check if your project name is available on GitHub. Avoid naming conflicts before starting your next project.',
  keywords: ['github', 'project names', 'repository search', 'name availability', 'developer tools'],
  authors: [{ name: 'NameSentry' }],
  openGraph: {
    title: 'NameSentry - Check Project Name Availability',
    description: 'Check if your project name is available on GitHub. Avoid naming conflicts before starting your next project.',
    type: 'website',
  },
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          {children}
        </main>
      </body>
    </html>
  );
}