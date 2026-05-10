export const metadata = {
  title: '만복재 - AI 사주 분석',
  description: '하늘이 새긴 당신의 여덟 글자. 만복 선생이 풀어드립니다.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 0, background: '#0a0705' }}>
        {children}
      </body>
    </html>
  );
}
