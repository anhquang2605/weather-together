import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
   CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: {  label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        // Add your own logic here to find the user in your database and verify their password
        // You can also use the `credentials` object passed to this function to query your database
        try{
          const res = await fetch('/api/auth/login',{
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { 'Content-Type': 'application/json' }
          });
          const user = await res.json();
          if (user && res.ok) {
              return Promise.resolve(user.data);
          }else{
              return Promise.reject(null);
          }
        }catch(err){
          return Promise.reject(null);
        }
       
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 0.05 * 60 * 60,// 3 minutes
  },
  callbacks: {
    jwt: async ({token, user}) => {
      if (user) {
        token.accessToken = user.username;
      }
      return token
    },
    async session({session, token}) {
        if(session.user){
            session.accessToken= token.accessToken;
        }
        return session
     
    },
  },
})
