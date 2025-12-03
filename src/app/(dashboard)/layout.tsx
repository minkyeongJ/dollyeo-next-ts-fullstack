import { redirect } from "next/navigation";
import { auth } from "@/auth/auth";
import { DashboardProviders } from "./providers";

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
        {/* 네비게이션 헤더 */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <span className="text-xl font-bold text-indigo-600">돌려요</span>
                <div className="ml-10 flex items-baseline space-x-4">
                  <a
                    href="/questions"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    질문 관리
                  </a>
                  <a
                    href="/participants"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    참여자 관리
                  </a>
                  <a
                    href="/roulette"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    룰렛 돌리기
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-4">
                  {session.user.name || session.user.email}
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* 메인 컨텐츠 */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </DashboardProviders>
  );
}

