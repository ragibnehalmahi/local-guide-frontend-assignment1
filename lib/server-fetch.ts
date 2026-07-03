// import { getCookie } from "@/services/auth/tokenHandler";

import { getNewAccessToken } from "@/services/auth/auth.service";
import { getCookie } from "@/services/auth/tokenHandlers";


const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://local-guide-backend-br5i.onrender.com/api/v1";

// /auth/login
const serverFetchHelper = async (endpoint: string, options: RequestInit): Promise<Response> => {
    const { headers, ...restOptions } = options;

    // 1. Handle potential token refresh first (only for authenticated routes)
    if (endpoint !== "/auth/refresh-token") {
        await getNewAccessToken();
    }

    // 2. Fetch the LATEST token after refresh logic
    const accessToken = await getCookie("accessToken");

    // 3. Construct outgoing request headers
    const requestHeaders: Record<string, string> = {
        ...((headers as Record<string, string>) || {}),
    };

    // Add authentication headers if token exists
    if (accessToken) {
        requestHeaders["Authorization"] = `Bearer ${accessToken}`;
        requestHeaders["Cookie"] = `accessToken=${accessToken}`;
    }

    // 4. Default to JSON content type for body-carrying requests
    if (restOptions.body && !requestHeaders["Content-Type"]) {
        requestHeaders["Content-Type"] = "application/json";
    }

    const response = await fetch(`${BACKEND_API_URL}${endpoint}`, {
        headers: requestHeaders,
        ...restOptions,
    });

    return response;
}

export const serverFetch = {
    get: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "GET" }),

    post: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "POST" }),

    put: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "PUT" }),

    patch: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "PATCH" }),

    delete: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "DELETE" }),

}

/**
 * 
 * serverFetch.get("/auth/me")
 * serverFetch.post("/auth/login", { body: JSON.stringify({}) })
 */