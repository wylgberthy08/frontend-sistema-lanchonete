import { NextRequest, NextResponse } from "next/server";
import { getCookie } from "@/lib/cookieServer";
import { api } from "./service/api";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname === "/") {
    return NextResponse.next();
  }

  const token = await getCookie();

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    const isValid = await validateToken(token);

    if (!isValid) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

async function validateToken(token: string) {
  if (!token) {
    return false;
  }

  try {
    await api.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
