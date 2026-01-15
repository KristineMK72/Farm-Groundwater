export const metadata = {
  title: "Christensen Farms – Groundwater & Nitrates",
  description: "Interactive map and well details for Dunnell, MN.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto" }}>{children}</body>
    </html>
  );
}
