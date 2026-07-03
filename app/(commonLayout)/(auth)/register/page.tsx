//local-guide-frontend-assignment\local-guide-frontend\my-app\app\(commonLayout)\(auth)\register\page.tsx 
import RegisterForm from "@/components/RegisterForm";



export default function RegisterPage() {
  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Join LocalGuide Today
        </h1>
        <p className="text-gray-600">
          Start your journey as a traveler or share your knowledge as a guide
        </p>
      </div>

      <RegisterForm />
    </div>
  );
}