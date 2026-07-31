import React from 'react';
import '@/app/globals.css';

export const metadata = {
  title: 'Questify | Gamified Productivity',
  description: 'Gamified task management platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* THIS LOADS ALL TAILWIND COLORS & ANIMATIONS INSTANTLY */}
        <script src="https://cdn.tailwindcss.com"></script>
        <link 
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}