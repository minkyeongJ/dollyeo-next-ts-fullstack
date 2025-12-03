import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
// import { connectDB } from "@/services/database.service";

export const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // TODO: 실제 데이터베이스에서 사용자 조회 구현
        // const user = await findUserByEmail(credentials.email);
        // if (!user || !await verifyPassword(credentials.password, user.password)) {
        //   return null;
        // }

        // 임시 사용자 (개발용)
        if (
          credentials.email === "test@example.com" &&
          credentials.password === "password123"
        ) {
          return {
            id: "1",
            email: "test@example.com",
            name: "테스트 사용자",
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard =
        nextUrl.pathname.startsWith("/questions") ||
        nextUrl.pathname.startsWith("/participants") ||
        nextUrl.pathname.startsWith("/roulette");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // 로그인 페이지로 리다이렉트
      } else if (isLoggedIn) {
        // 로그인 상태에서 로그인/회원가입 페이지 접근 시 대시보드로
        if (
          nextUrl.pathname === "/login" ||
          nextUrl.pathname === "/register"
        ) {
          return Response.redirect(new URL("/questions", nextUrl));
        }
      }
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

