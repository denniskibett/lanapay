import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';

export default function LogoutPage() {
  const router = useRouter();

  async function logout() {
    try {
      await supabase.auth.signOut();
      router.push('/login'); // Redirect to login page
    } catch (error) {
      console.error(error);
    }
  }

  logout();

  return <div>Logging out...</div>;
}