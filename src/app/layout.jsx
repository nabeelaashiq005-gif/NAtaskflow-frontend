import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata = {
  title: {
    default: "NATaskFlow — Collaborative workspace for teams",
    template: "%s — NATaskFlow",
  },
  description:
    "NATaskFlow is a real-time collaborative workspace for managing projects and tasks.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="dark")document.documentElement.classList.add("dark");}catch(e){}`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { fontSize: "14px" },
            success: { iconTheme: { primary: "#3D5A80", secondary: "#fff" } },
          }}
        />
      </body>
    </html>
  );
}
