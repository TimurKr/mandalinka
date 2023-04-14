import './globals.css';

import 'material-symbols/outlined.css';
import 'material-symbols/rounded.css';
import 'react-datetime/css/react-datetime.css';
import 'flowbite/dist/flowbite.min.css';

import { Lora } from 'next/font/google';

import SupabaseProvider from '../lib/supabase-provider';

const font = Lora({
  subsets: ['latin-ext'],
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'Mandalinka',
    template: '%s | Mandalinka',
  },
  description: 'Mandalinka webpage',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk" className={font.className}>
      <body>
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
