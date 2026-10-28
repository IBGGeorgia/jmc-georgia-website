import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'JMC Georgia | ოფიციალური წარმომადგენლობა', template: '%s | JMC Georgia' },
  description: 'JMC Georgia — აღმოაჩინე ავტომობილები, შეადარე კომპლექტაციები და გაეცანი ტესტ-დრაივის ინფორმაციას.',
  robots: { index: false, follow: false }, // Keep staging site out of search until content is approved.
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ka"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link rel="preconnect" href="https://api.fontshare.com"/><link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous"/><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&display=swap"/><link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=switzer@1,2&display=swap"/></head><body>{children}</body></html>;
}
