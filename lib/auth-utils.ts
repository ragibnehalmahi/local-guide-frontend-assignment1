export type UserRole = "admin" | "guide" | "tourist" | "common";

// exact : ["/my-profile", "settings"]
//   patterns: [/^\/dashboard/, /^\/patient/], // Routes starting with /dashboard/* /patient/*
export type RouteConfig = {
    exact: string[],
    patterns: RegExp[],
}

export const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

export const commonProtectedRoutes: RouteConfig = {
    exact: ["/my-profile", "/settings", "/change-password"],
    patterns: [], // [/password/change-password, /password/reset-password => /password/*]
}

export const guideProtectedRoutes: RouteConfig = {
    patterns: [/^\/guide/],  
    exact: [], // "/assistants"
}

export const adminProtectedRoutes: RouteConfig = {
    patterns: [/^\/admin/], // Routes starting with /admin/*
    exact: [], // "/admins"
}

export const touristProtectedRoutes: RouteConfig = {
    patterns: [/^\/tourist/], // Routes starting with /tourist/*
    exact: [], // "/tourist"
}

export const isAuthRoute = (pathname: string) => {
    return authRoutes.some((route: string) => route === pathname);
}

export const isRouteMatches = (pathname: string, routes: RouteConfig): boolean => {
    if (routes.exact.includes(pathname)) {
        return true;
    }
    return routes.patterns.some((pattern: RegExp) => pattern.test(pathname))
    // if pathname === /dashboard/my-appointments => matches /^\/dashboard/ => true
}

export const getRouteOwner = (pathname: string): "admin" | "guide" | "tourist" | "common" | null => {
    if (isRouteMatches(pathname, adminProtectedRoutes)) {
        return "admin";
    }
    if (isRouteMatches(pathname, guideProtectedRoutes)) {
        return "guide";
    }
    if (isRouteMatches(pathname, touristProtectedRoutes)) {
        return "tourist";
    }
    if (isRouteMatches(pathname, commonProtectedRoutes)) {
        return "common";
    }
    return null;
}

export const getDefaultDashboardRoute = (role: UserRole): string => {
    if (role === "admin") {
        return "/admin/dashboard";
    }
    if (role === "guide") {
        return "/guide/dashboard";
    }
    if (role === "tourist") {
        return "/tourist/dashboard";
    }
    return "/";
}

export const isValidRedirectForRole = (redirectPath: string, role: UserRole): boolean => {
    const routeOwner = getRouteOwner(redirectPath);

    if (routeOwner === null || routeOwner === "common") {
        return true;
    }

    // Fixed: Both routeOwner and role are lowercase strings ("admin", "guide", "tourist")
    if (routeOwner === role) {
        return true;
    }

    return false;
}




// import { UserRole } from '@/types/user.interface';
 

// export type RouteConfig = {
//   exact: string[];
//   patterns: RegExp[];
// };

// export const authRoutes = ["/login", "/register", "/forgot-password"];

// export const commonProtectedRoutes: RouteConfig = {
//   exact: ["/my-profile", "/settings", "/change-password"],
//   patterns: [],
// };

// export const touristProtectedRoutes: RouteConfig = {
//   patterns: [/^\/dashboard/, /^\/bookings/],
//   exact: [],
// };

// export const guideProtectedRoutes: RouteConfig = {
//   patterns: [/^\/guide/],
//   exact: [],
// };

// export const adminProtectedRoutes: RouteConfig = {
//   patterns: [/^\/admin/],
//   exact: [],
// };

// export const isAuthRoute = (pathname: string) => {
//   return authRoutes.some((route: string) => route === pathname);
// };

// export const isRouteMatches = (pathname: string, routes: RouteConfig): boolean => {
//   if (routes.exact.includes(pathname)) {
//     return true;
//   }
//   return routes.patterns.some((pattern: RegExp) => pattern.test(pathname));
// };

// export const getRouteOwner = (pathname: string): UserRole | "COMMON" | null => {
//   if (isRouteMatches(pathname, adminProtectedRoutes)) {
//     return UserRole.ADMIN;
//   }
//   if (isRouteMatches(pathname, guideProtectedRoutes)) {
//     return UserRole.GUIDE;
//   }
//   if (isRouteMatches(pathname, touristProtectedRoutes)) {
//     return UserRole.TOURIST;
//   }
//   if (isRouteMatches(pathname, commonProtectedRoutes)) {
//     return "COMMON";
//   }
//   return null;
// };

// export const getDefaultDashboardRoute = (role: UserRole): string => {
//   if (role === UserRole.ADMIN) {
//     return "/admin/dashboard";
//   }
//   if (role === UserRole.GUIDE) {
//     return "/guide/dashboard";
//   }
//   if (role === UserRole.TOURIST) {
//     return "/dashboard";
//   }
//   return "/";
// };

// export const isValidRedirectForRole = (redirectPath: string, role: UserRole): boolean => {
//   const routeOwner = getRouteOwner(redirectPath);

//   if (routeOwner === null || routeOwner === "COMMON") {
//     return true;
//   }

//   if (routeOwner === role) {
//     return true;
//   }

//   return false;
// };