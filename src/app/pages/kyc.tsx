import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';
import bcrypt from 'bcryptjs';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Fetch the user profile using the email
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id, password')
        .eq('email', email)
        .single();

      if (fetchError) throw fetchError;

      const { password: hashedPassword } = data;

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, hashedPassword);

      if (!isPasswordValid) {
        setError('Invalid email or password');
        return;
      }

      // Password is valid, proceed with the sign-in process
      alert('Sign in successful!');
      router.push('/dashboard');  // Redirect to the dashboard or another page
    } catch (error: any) {
      setError(`Error signing in: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <form onSubmit={handleSignIn} className="space-y-4">
        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}
        <div>
          <label className="block">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border px-2 py-1"
          />
        </div>
        <div>
          <label className="block">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border px-2 py-1"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Sign In
        </button>
      </form>
    </div>
  );
}
