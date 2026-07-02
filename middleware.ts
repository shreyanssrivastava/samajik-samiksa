import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FB_SAM_PRJ_ID,
      clientEmail: process.env.FB_SAM_CLT_EMAIL,
      privateKey: process.env.FB_SAM_PVT_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function middleware(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.rewrite(new URL("/404", request.url));
    }

    const decoded = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true);

    if (decoded.uid !== process.env.SAM_ADMIN_UID) {
      return NextResponse.rewrite(new URL("/404", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.rewrite(new URL("/404", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};