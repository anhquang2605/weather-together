import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
const url = process.env.NEXTAUTH_URL;
const expiration = process.env.NEXTAUTH_JWT_EXPIRATION;
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
          const {username, password, remember} = credentials;
          const res = await fetch(url+'/api/auth/login',{
            method: 'POST',
            body: JSON.stringify({
              username,
              password
            }),
            headers: { 'Content-Type': 'application/json' }
          });

          const user = await res.json();
          user.remember = remember;
          if (user && res.ok) {
              return user;
          }else{
              return null;
          }
        }catch(err){
          return null;
        }
       
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt: async ({token, user}) => {
      
      if(user && user.data){
        const theUser = JSON.parse(user.data);  
        const {username, email, location, remember} = theUser;
        token.user = {
          username,
          email,
          location,
          remember
        }
      }
      
      return token
    },
    session: async ({session, token, user}) => {
        session.user = token.user;
        if(token.user && token.user.remember){
          session.maxAge = expiration;
        }
        return session
     
    },
  },
})
