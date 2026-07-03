//local-guide-frontend/my-app/app/(commonLayout)/(auth)/login/page.tsx 
import LoginForm from '@/components/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome Back to LocalGuide
            </h1>
            <p className="text-gray-600 mb-6">
              Sign in to discover amazing local experiences or manage your guide services.
            </p>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-600">✓</span>
                </div>
                <span>Discover unique local experiences</span>
              </div>

              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-600">✓</span>
                </div>
                <span>Connect with passionate local guides</span>
              </div>

              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-600">✓</span>
                </div>
                <span>Book tours with confidence</span>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                <strong>New to LocalGuide?</strong> Join our community of travelers and guides.
              </p>
              <Link
                href="/register"
                className="mt-2 inline-block text-blue-600 hover:underline"
              >
                Create your account →
              </Link>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}