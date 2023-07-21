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
      if(user){
        const returnUser = {
          username: user.username,
          email: user.email,
          location: user.location,
        }
        console.log(returnUser);
        token.user = returnUser
      }
      return token
    },
    async session({session, token, user}) {
      //console.log(user);
        session.user = token.user;
        return session
     
    },
  },
})
