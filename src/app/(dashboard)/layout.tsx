import { redirect } from "next/navigation";
import { auth } from "@/auth/auth";
import { DashboardProviders } from "./providers";
import { DashboardHeader } from "@/components/features";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <DashboardProviders>
      <div className="min-h-screen bg-gray-100">
        <DashboardHeader
          userName={session.user.name}
          userEmail={session.user.email}
        />

        {/* 메인 컨텐츠 */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </DashboardProviders>
  );
}
