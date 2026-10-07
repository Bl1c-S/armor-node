import { RegisterForm } from "@/components/auth";

export default function RegistrationPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center page-container py-16">
        <RegisterForm />
      </main>
    </div>
  );
}
