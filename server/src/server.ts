import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

import connection from './config/connection.js';

import typeDefs from './schema/typeDefs.js';
import resolvers from './schema/resolvers.js';
import User from './models/User.js';

const { verify } = jwt;
const app = express();
const PORT = process.env.PORT || 3333;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

connection.once('open', async () => {
  await server.start();
  
  // Middleware
  app.use(
    '/graphql',
    express.json(),
    // Allow the resolvers to access client-side cookies through context.req.cookies
    cookieParser(),
    expressMiddleware(server, {
      // Attach the context object for all resolvers - The return value of the function is what your context will be
      context: async ({ req, res }: {req: any; res: any}) => {
        const pet_token = req.cookies?.pet_token;

        if (pet_token) {
          try {

            if (!process.env.JWT_SECRET) {
              console.log('MUST ADD JWT_SECRET TO .env!');

              return {
                req: req,
                res: res
              }
            }

            const userData = verify(pet_token, process.env.JWT_SECRET);
            
            if (!userData || typeof userData === 'string') {
              return {
                req: req,
                res: res
              }
            }

            const user = await User.findById(userData.user_id);

            req.user = user;

          } catch (error) {
            console.log('JWT VERIFICATION ERROR', error);
          }
        }

        return {
          req: req,
          res: res
        };
      }
    }),
  );

  app.listen(PORT, () => {
    console.log('Express server started on', PORT);
  });
});


