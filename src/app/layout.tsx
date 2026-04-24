import type { Metadata, Viewport } from "next";
import "./globals.css";
import PhoneFrame from "@/components/PhoneFrame";
import TabBar from "@/components/TabBar";
import DragScroll from "@/components/DragScroll";

export const metadata: Metadata = {
  title: "FaceCheck · Web Prototype",
  description: "Mobile-first web prototype for FaceCheck — objective facial palsy assessment.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // enable env(safe-area-inset-*) so content stays clear of notch / home indicator
  themeColor: "#0A7AE0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PhoneFrame>
          <div className="relative w-full h-full">
            <DragScroll className="absolute inset-0 overflow-y-auto fc-scroll">
              {children}
            </DragScroll>
            <TabBar />
          </div>
        </PhoneFrame>
      </body>
    </html>
  );
}
