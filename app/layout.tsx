import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'JMC Georgia | ოფიციალური წარმომადგენლობა', template: '%s | JMC Georgia' },
  description: 'JMC Georgia — აღმოაჩინე ავტომობილები, შეადარე კომპლექტაციები და მოითხოვე ტესტ-დრაივი.',
  robots: { index: false, follow: false }, // Keep staging site out of search until content is approved.
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ka"><body>{children}</body></html>;
}
