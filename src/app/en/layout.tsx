export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div lang="en" className="contents">
      {children}
    </div>
  );
}
