import { notFound } from "next/navigation";
// import { getSharedRoulette } from "@/services/database.service";

interface SharePageProps {
  params: Promise<{
    shareToken: string;
  }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { shareToken } = await params;

  // TODO: 실제 공유 데이터 조회 구현
  // const sharedData = await getSharedRoulette(shareToken);
  // if (!sharedData) {
  //   notFound();
  // }

  // 임시 데이터
  const sharedData = {
    title: "팀 회의 발표자 선정",
    items: ["김철수", "이영희", "박민수", "최지연"],
  };

  if (!shareToken) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          {sharedData.title}
        </h1>
        <p className="text-gray-500 text-center mb-6">
          공유된 룰렛입니다
        </p>

        <div className="space-y-2 mb-6">
          <h2 className="text-sm font-medium text-gray-700">참여자 목록</h2>
          {sharedData.items.map((item, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 rounded-lg text-gray-800"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="/"
            className="text-indigo-600 hover:text-indigo-500 text-sm"
          >
            돌려요 시작하기 →
          </a>
        </div>
      </div>
    </div>
  );
}

