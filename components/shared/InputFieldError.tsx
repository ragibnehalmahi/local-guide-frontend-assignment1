import { ReactNode } from 'react';

interface InputFieldErrorProps {
  field: string;
  state: {
    success?: boolean;
    message?: string;
    errors?: Record<string, string | string[]>;
  } | null;
}

const InputFieldError = ({ field, state }: InputFieldErrorProps) => {
  if (!state || !state.errors || !state.errors[field]) {
    return null;
  }

  const error = state.errors[field];
  
  return (
    <div className="text-red-600 text-sm mt-1">
      {Array.isArray(error) ? (
        <ul className="list-disc list-inside space-y-1">
          {error.map((err, index) => (
            <li key={index}>{err}</li>
          ))}
        </ul>
      ) : (
        <p>{error}</p>
      )}
    </div>
  );
};

export default InputFieldError;