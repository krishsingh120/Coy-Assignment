import './globals.css';

export const metadata = {
  title: 'Coy Discover — Find Your Match',
  description: 'Swipe-based discovery with genuine mutual matching and zero privacy leaks.'
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen selection:bg-rose-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
