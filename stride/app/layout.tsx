import type { Metadata } from 'next';
import './globals.css';
import './preferences.css';
import { PreferencesProvider } from '../components/Preferences';
export const metadata: Metadata = { metadataBase: new URL('https://stride-focus-planner-aspen.honestcamel13.chatgpt.site'), title: 'Stride — Find your focus', description: 'An intentional space for your tasks, study sessions, schedule, and daily progress.', openGraph: { title: 'Stride — Find your focus', description: 'Small steps. Meaningful progress.' } };
export default function RootLayout({ children }: {
    children: React.ReactNode;
}) { return <html lang="en"><body><PreferencesProvider>{children}</PreferencesProvider></body></html>; }
