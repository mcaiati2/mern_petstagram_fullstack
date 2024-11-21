import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cookieParser from 'cookie-parser';
import connection from './config/connection.js';
import { authenticate } from './services/auth.js';
import typeDefs from './schema/typeDefs.js';
import resolvers from './schema/resolvers.js';
const app = express();
const PORT = process.env.PORT || 3333;
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
connection.once('open', async () => {
    await server.start();
    // Middleware
    app.use('/graphql', express.json(), 
    // Allow the resolvers to access client-side cookies through context.req.cookies
    cookieParser(), expressMiddleware(server, {
        // Attach the context object for all resolvers - The return value of the function is what your context will be
        context: authenticate
    }));
    app.listen(PORT, () => {
        console.log('Express server started on', PORT);
    });
});
