//my-app/proxy.ts   

import jwt, { JwtPayload } from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from './lib/auth-utils';

// ১. ফাংশনটিকে 'proxy' নামে এক্সপোর্ট করুন
export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const accessToken = request.cookies.get("accessToken")?.value || null;

    const secret = process.env.JWT_ACCESS_SECRET;
    let userRole: UserRole | null = null;

    if (accessToken) {
        try {
            if (!secret) {
                console.error("JWT_ACCESS_SECRET is missing!");
                return NextResponse.next();
            }
            const verifiedToken = jwt.verify(accessToken, secret) as JwtPayload;
            if (verifiedToken && typeof verifiedToken !== "string") {
                userRole = (verifiedToken.role as string).toLowerCase() as UserRole;
            }
        } catch (error) {
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete("accessToken");
            return response;
        }
    }

    const isAuth = isAuthRoute(pathname);
    const routerOwner = getRouteOwner(pathname);

    // লুপ বন্ধ করার লজিক
    if (accessToken && isAuth && userRole) {
        return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url));
    }
    if (!accessToken && isAuth) return NextResponse.next();
    if (routerOwner === null) return NextResponse.next();

    if (!accessToken) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (routerOwner === "common") return NextResponse.next();

    if (userRole !== routerOwner) {
        return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
    }

    return NextResponse.next();
}

// ২. সবশেষে ডিফল্ট এক্সপোর্ট যোগ করুন (Turbopack এর জন্য এটি প্রয়োজন হতে পারে)
export default proxy;

// ৩. কনফিগারেশন
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
    ],
};
