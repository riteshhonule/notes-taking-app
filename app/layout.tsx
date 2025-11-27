import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Keep Notes - Your Digital Notebook',
  description: 'A simple and elegant notes taking application to organize your thoughts and ideas',
  keywords: ['notes', 'notebook', 'productivity', 'task management'],
  openGraph: {
    title: 'Keep Notes',
    description: 'Organize your thoughts with Keep Notes',
    type: 'website',
    images: [
      {
        url: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?w=500',
        width: 500,
        height: 500,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
