import './globals.css';

export const metadata = {
  title: 'Echoes',
  description: 'Every place has a story. Now you can hear it.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
