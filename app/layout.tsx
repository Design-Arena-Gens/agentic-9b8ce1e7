import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vendor Resource Submission',
  description: 'Submit resource list, budget, optional CV and rate card.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container">
            <h1>Vendor Portal</h1>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="site-footer">
          <div className="container">? {new Date().getFullYear()} Vendor Portal</div>
        </footer>
      </body>
    </html>
  );
}
