export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen w-full items-center justify-center p-4 mx-auto">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
