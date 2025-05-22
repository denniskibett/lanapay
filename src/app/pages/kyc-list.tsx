import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/router';
import Layout from '@/app/layout';

export default function KYCList() {
  const [profiles, setProfiles] = useState<any[]>([]);
  
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, email, wallet_address, business_name, password');

      if (error) throw error; // No need for type assertion here

      setProfiles(data);
    } catch (error) { // Removed explicit Error type
      // Type guard to check if it's an Error
      if (error instanceof Error) {
        alert(`Error fetching KYC records: ${error.message}`);
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">KYC List</h1>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Wallet Address</th>
              <th className="border px-2 py-1">Business Name</th>
              <th className="border px-2 py-1">Password</th>
            </tr>
          </thead>
          <tbody>
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <tr key={profile.wallet_address}> {/* Changed key to wallet_address since id isn't selected */}
                  <td className="border px-2 py-1">{profile.name}</td>
                  <td className="border px-2 py-1">{profile.email}</td>
                  <td className="border px-2 py-1">{profile.wallet_address}</td>
                  <td className="border px-2 py-1">{profile.business_name}</td>
                  <td className="border px-2 py-1">{profile.password}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="border px-2 py-1 text-center"> {/* Fixed colspan to 5 */}
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}