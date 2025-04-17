'use client'
import Nav from "./nav/Nav";
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <>
          <Nav />
          <div style={{ paddingTop : '60px' }}>
            {children}
          </div>
        </>
      </body>
    </html>
  );
}
