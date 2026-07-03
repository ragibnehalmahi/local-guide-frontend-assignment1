//my-app/components/RegisterForm.tsx      

'use client';

import { registerUser } from '@/services/auth/auth.service';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import InputFieldError from './shared/InputFieldError';
import { Button } from './ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import Link from 'next/link';

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(registerUser, null);
  const [selectedRole, setSelectedRole] = useState<'tourist' | 'guide'>('tourist');

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(typeof state.message === 'string' ? state.message : "Registration failed");
    }
    if (state?.success) {
      toast.success("Account created successfully!");
    }
  }, [state]);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
        <p className="text-gray-500 mt-2">Join LocalGuide today</p>
      </div>

      <form action={formAction} className="space-y-5">
        <FieldGroup className="space-y-4">
          {/* Full Name */}
          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input id="name" name="name" type="text" placeholder="John Doe" required />
            <InputFieldError field="name" state={state} />
          </Field>

          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <Input id="email" name="email" type="email" placeholder="john@example.com" required />
            <InputFieldError field="email" state={state} />
          </Field>

          {/* Password */}
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" name="password" type="password" placeholder="••••••••" required />
            <InputFieldError field="password" state={state} />
          </Field>

          {/* Role Selection (Simple & Clean) */}
          <Field>
            <FieldLabel>Register as a:</FieldLabel>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <input type="hidden" name="role" value={selectedRole} />

              <Button
                type="button"
                variant={selectedRole === 'tourist' ? 'default' : 'outline'}
                onClick={() => setSelectedRole('tourist')}
                className="w-full"
              >
                Tourist
              </Button>

              <Button
                type="button"
                variant={selectedRole === 'guide' ? 'default' : 'outline'}
                onClick={() => setSelectedRole('guide')}
                className="w-full"
              >
                Guide
              </Button>
            </div>
            <InputFieldError field="role" state={state} />
          </Field>
        </FieldGroup>

        <Button type="submit" disabled={isPending} className="w-full py-6 text-lg font-semibold">
          {isPending ? 'Processing...' : 'Sign Up'}
        </Button>

        <div className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;