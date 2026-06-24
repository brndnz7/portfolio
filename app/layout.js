import { Analytics } from '@vercel/analytics/react';
import { Manrope } from 'next/font/google';
import '@/assets/globals.scss';
import LenisScroller from '@/components/UI/LenisScroller/LenisScroller';
import Header from '@/components/Layout/Header/Header';
import Footer from '@/components/Layout/Footer/Footer';
import CustomCursor from '@/components/UI/Elements/CustomCursor/CustomCursor';

const bodyFont = Manrope({ subsets: ['latin'], variable: '--font-primary', weight: ['300', '400', '500', '700'], display: 'swap' });

export const metadata = {
  metadataBase: new URL('https://portfolio-theta-wine-40.vercel.app'),
  title: { default: 'Baran Deniz - Développeur web', template: '%s - Baran Deniz' },
  description: 'Portfolio de compétences de Baran Deniz, développeur web en BUT MMI à Strasbourg.',
  openGraph: { title: 'Baran Deniz - Développeur web', description: 'Projets, compétences et démarche de développement web.', type: 'website', locale: 'fr_FR' }
};

export const viewport = { themeColor: '#FFD600', colorScheme: 'dark' };

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={bodyFont.variable}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <CustomCursor />
        <LenisScroller />
        <Analytics />
      </body>
    </html>
  );
}
