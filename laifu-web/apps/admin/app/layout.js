import "./globals.css";

export const metadata = {
  title: "离婚力量表后台 MVP",
  description: "离婚力量表后台 MVP 第一轮",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
