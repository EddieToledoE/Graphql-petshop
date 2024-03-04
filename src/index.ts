import "dotenv/config";
import { ApolloServer, gql } from 'apollo-server';
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "../defs/defs";
import { resolvers } from "../controllers/resolvers";
import dbInit from "../db/mongodb";
import jwt, { JwtPayload } from 'jsonwebtoken';

const server = new ApolloServer({
  typeDefs,
  resolvers,
//   context: ({ req }) => {
//       // Verificar el token en el encabezado "Authorization"
//       const token = req.headers.authorization || '';
//       const operationType = req.body.operationName ? req.body.operationName : '';
//       if (operationType === "Mutation") {
//           const isRegisterMutation = req.body.query.includes("registerUser");
//           const isLoginMutation = req.body.query.includes("logInUser");
//           if (isRegisterMutation || isLoginMutation) {
//               return {};
//           }
//       }
//       try {
//           const secret = 'secret';
//           const decoded = jwt.verify(token, secret) as JwtPayload;
//           const userId = decoded.userId;
//           return { userId };
//       } catch (error) {
//           throw new Error('No estás autenticado');
//       }
//   },
});

server.listen().then(({ url }) => {
  console.log(`Servidor listo en ${url}`);
  dbInit();
});
