import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import pool from '../../../lib/db'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const conn = await pool.getConnection()
        try {
          const [users] = await conn.query('SELECT * FROM users WHERE username = ?', [credentials.username])
          conn.release()
          if (users.length === 0) {
            throw new Error('No user found')
          }
          const user = users[0]

          if (credentials.password === user.password) {
            return { id: user.id, name: user.username }
          } else {
            throw new Error('Password incorrect')
          }
        } catch (error) {
          conn.release()
          throw new Error(error.message)
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin'
  }
}

export default NextAuth(authOptions)
