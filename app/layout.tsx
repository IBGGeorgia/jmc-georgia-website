import type { Metadata } from 'next';
import '@fontsource/firago/400.css';
import '@fontsource/firago/500.css';
import '@fontsource/firago/600.css';
import '@fontsource/firago/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'JMC Georgia | ოფიციალური წარმომადგენლობა', template: '%s | JMC Georgia' },
  description: 'JMC Georgia — აღმოაჩინე ავტომობილები, შეადარე კომპლექტაციები და მოითხოვე ტესტ-დრაივი.',
  robots: { index: false, follow: false }, // Keep staging site out of search until content is approved.
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ka"><body>{children}</body></html>;
}
