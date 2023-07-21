import { Session } from 'next-auth';
import { Location } from './types/location';
declare module 'next-auth' {
  interface Session {
    user: {
      username?: string | null | undefined;
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
      location?: Location | null | undefined; // Add your custom property here
    };
  }
}