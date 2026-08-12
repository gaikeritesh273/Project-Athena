import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { I18nProvider } from '@/lib/i18n';
import { ThemeProvider } from '@/lib/theme';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'ATHENA — AI-Powered Media Literacy Platform | UNESCO Youth Hackathon 2026',
  description: "Don't just know what to believe. Learn how to evaluate digital information with AI-assisted Trust Passports, Perspective Explorers, Narrative Memory, and Media Literacy Tutors.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-main)' }}>
        <ThemeProvider>
          <I18nProvider>
            <AuthProvider>
              <Navbar />
              <main className="min-h-[calc(100vh-4rem)]">{children}</main>
              <Toaster position="bottom-right" toastOptions={{
                style: {
                  background: 'var(--color-bg-surface)',
                  color: 'var(--color-text-main)',
                  border: '1px solid var(--color-glass-border)'
                }
              }} />
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}