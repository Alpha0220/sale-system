import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Quotation Request System | ระบบบันทึกคำขอเปิดบิล",
    description: "ระบบภายในสำหรับจัดการคำขอเปิดบิลและติดตาม Invoice",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="th">
            <body className="antialiased">
                <main className="min-h-screen">
                    {children}
                </main>
            </body>
        </html>
    );
}
