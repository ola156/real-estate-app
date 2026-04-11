import { Roboto } from 'next/font/google'
import "./globals.css";
import Provider from "./Provider";
import { ClerkProvider } from '@clerk/nextjs';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})


export default function RootLayout({ children }) {
  return (
            <ClerkProvider>
    <html
      lang="en"
      className={`${roboto.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">

        <Provider>
         {children}
       
       </Provider>
      
      </body>
    </html>
     </ClerkProvider>
  );
}
