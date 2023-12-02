import dbConnect from '@lib/dbConnect';
import User from '@models/User';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const dynamic = 'force-dynamic';

const authOption = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account, trigger }) {
      if (account) {
        token.accessToken = account.access_token;
        token.accessTokenExpires = account.expires_at;
      }

      /*
      isNewUser deprecated되고 대신 회원가입(signUp)이벤트인지 트리거와 비교하려고 했으나,
      trigger === signUp 인 조건을 찾지 못해 signIn 인 경우 디비에 유저가 없으면 넣게 변경
      */
      if (trigger === 'signIn') {
        await dbConnect();
        let loginUser = await User.findOne({ email: token.email })
          .lean()
          .exec();

        if (!loginUser) {
          const newUser = new User({
            nickname: token.name,
            email: token.email,
            socialLoginType: account ? account.provider : undefined,
            profileImage: token.picture,
            blogPosts: [],
            comments: [],
          });
          try {
            loginUser = await newUser.save();
          } catch (error) {
            throw error;
          }
        }

        if (!token.mongoId) {
          token.mongoId = loginUser._id;
        }
      }

      return token;
    },
    async session({ token }) {
      return token;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOption);

export { handler as GET, handler as POST, authOption };
