import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"SaansAI | Breathe smarter. Live greener.",description:"Your hyperlocal, explainable urban air quality companion for families."};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}