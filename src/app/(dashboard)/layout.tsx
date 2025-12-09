// import { redirect } from "next/navigation";
// import { auth } from "@/auth/auth";
import { DashboardProviders } from "./providers";
import { DashboardHeader } from "@/components/features";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: 인증 로직 임시 비활성화 - 나중에 다시 활성화 필요
  // const session = await auth();
  // if (!session?.user) {
  //   redirect("/login");
  // }

  // 임시 사용자 정보
  const tempUser = {
    name: "테스트 사용자",
    email: "test@example.com",
  };

  return (
    <DashboardProviders>
      <div className="min-h-screen" style={{ background: "var(--background)" }}>
        <DashboardHeader userName={tempUser.name} userEmail={tempUser.email} />

        {/* 메인 컨텐츠 */}
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </DashboardProviders>
  );
}
