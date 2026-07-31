import { Plus_Jakarta_Sans } from 'next/font/google';
import '../globals.css';

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800']
});

export const metadata = {
  title: 'Questify | Gamified Productivity',
  description: 'Gamified task management platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* THIS LOADS ALL TAILWIND COLORS & ANIMATIONS INSTANTLY */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className={jakarta.className}>{children}</body>
    </html>
  );
}