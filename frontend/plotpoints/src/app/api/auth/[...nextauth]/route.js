import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
          })
        });

        const user = await res.json();

        if (res.ok && user) {
          // Return user object if authentication is successful
          return user;
        }
        // Return null if authentication fails
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
    //maxAge: 60 * 60, // 1 hour in seconds
  },
  callbacks: {
    async jwt({ token, user }) {
      if(user?.token) {
        token.accessToken = user.token;
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.sub; // Add user ID to session
      session.accessToken = token.accessToken; // Add access token to session
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin" // Redirect to sign-in page on error
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };