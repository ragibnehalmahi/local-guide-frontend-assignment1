import jwt, { JwtPayload } from 'jsonwebtoken';

// For server-side (Node.js environment - Next.js server components/middleware)
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

/**
 * Verify JWT token (Server-side only)
 * This matches your backend's verifyToken function
 */
export async function verifyToken(token: string): Promise<JwtPayload | string | null> {
  try {
    // In server-side, we can use the same jsonwebtoken library
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error: any) {
    console.error('Token verification error:', error.message);
    
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    
    return null;
  }
}

/**
 * Decode JWT token without verification (Client-safe)
 * Can be used on client-side to extract payload
 */
export function decodeToken(token: string): JwtPayload | null {
  try {
    // This is safe for client-side as it doesn't verify, only decodes
    const decoded = jwt.decode(token) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error('Token decoding error:', error);
    return null;
  }
}

/**
 * Check if token is expired (Client-side safe)
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
}

/**
 * Extract user info from token (Common use)
 */
export interface TokenUser {
  id: string;
  email: string;
  role: string;
  status?: string;
  iat?: number;
  exp?: number;
}

export function getUserFromToken(token: string): TokenUser | null {
  try {
    const decoded = decodeToken(token);
    if (!decoded) return null;
    
    return {
      id: decoded.id as string,
      email: decoded.email as string,
      role: decoded.role as string,
      status: decoded.status as string,
      iat: decoded.iat,
      exp: decoded.exp,
    };
  } catch (error) {
    console.error('Error extracting user from token:', error);
    return null;
  }
}

/**
 * Generate mock token for development (Optional)
 * Only use in development environment
 */
export function generateMockToken(payload: any): string {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Mock tokens only allowed in development');
  }
  
  return jwt.sign(payload, 'development-secret', { expiresIn: '7d' });
}