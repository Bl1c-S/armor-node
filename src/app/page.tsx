import { Header } from "@/components/layout";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center page-container py-16">
        <div className="text-center space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Hello World
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Welcome to ArmorNode.
          </p>
        </div>
      </main>
    </div>
  );
}
