//local-guide-frontend-assignment\local-guide-frontend\my-app\app\(commonLayout)\(auth)\layout.tsx 
import { ReactNode } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/services/auth/auth.service';
import { redirect } from 'next/navigation';
import { getDefaultDashboardRoute } from '@/lib/auth-utils';

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Check if user is already logged in
  const user = await getCurrentUser();
  if (user) {
    const role = user.role;
    const finalRedirect = getDefaultDashboardRoute(role as any);
    redirect(finalRedirect);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                LocalGuide
              </Link>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link href="/" className="text-gray-700 hover:text-blue-600">
                  Home
                </Link>
                <Link href="/explore" className="text-gray-700 hover:text-blue-600">
                  Explore Tours
                </Link>
                <Link href="/become-a-guide" className="text-gray-700 hover:text-blue-600">
                  Become a Guide
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            © {new Date().getFullYear()} LocalGuide. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}