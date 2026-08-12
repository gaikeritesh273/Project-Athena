import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { I18nProvider } from '@/lib/i18n';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'ATHENA — AI-Powered Media Literacy Platform | UNESCO Youth Hackathon 2026',
  description: "Don't just know what to believe. Learn how to evaluate digital information with AI-assisted Trust Passports, Perspective Explorers, Narrative Memory, and Media Literacy Tutors.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="bg-[#0B0F19] text-[#F8FAFC] antialiased">
        <I18nProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-[calc(100vh-4rem)]">{children}</main>
            <Toaster position="bottom-right" toastOptions={{
              style: {
                background: '#111827',
                color: '#F8FAFC',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }
            }} />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}