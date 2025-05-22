import NextAuth from 'next-auth';
import { supabaseUrl, supabaseKey, supabaseSecret } from '../utils/supabaseClient';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    {
      id: 'supabase',
      type: 'oauth',
      clientId: supabaseKey,
      clientSecret: supabaseSecret,
      authorizationUrl: `${supabaseUrl}/auth/v1/authorize`,
      tokenUrl: `${supabaseUrl}/auth/v1/token`,
      profileUrl: `${supabaseUrl}/auth/v1/user`,
      profile: (profile) => {
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
        };
      },
    },
  ],
  // Enable session support
  session: {
    jwt: true,
  },
  // Enable KYC (Know Your Customer) flow
  kyc: {
    enabled: true,
  },
});