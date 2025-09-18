function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-screen w-screen bg-zinc-950 flex justify-center items-center">
      {children}
    </main>
  );
}

export default AuthLayout;
