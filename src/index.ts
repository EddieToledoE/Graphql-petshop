import "dotenv/config";
import { ApolloServer, gql } from "apollo-server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "../defs/defs";
import { resolvers } from "../resolvers/resolvers";
import dbInit from "../db/mongodb";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {

    const token = req.headers.authorization;

    if (token) {
      const operationType = req.body.operationName ? req.body.operationName : '';
      console.log(operationType);
      
      if (operationType === "LogIn") {
        const isRegisterMutation = req.body.query.includes("registerUser");
        const isLoginMutation = req.body.query.includes("logInUser");
        if (isRegisterMutation || isLoginMutation) {
          return {};
        }
      }
      try {
        const secret = 'secret';
        const decoded = jwt.verify(token, secret) as JwtPayload;
        const userId = decoded._id
        const res = await User.findById(userId)
        if(!res){
        return decoded;
        }else{
          throw Error("La credencial no es valida")
        }
      } catch (error) {
        console.log("No estás autenticado");
        throw Error("Las credenciales expiraron")
      }
    }else {
      if (req.body.query.includes("registerUser") || req.body.query.includes("logInUser")) {
        return {}
      }
      throw Error("No hay credenciales registradas")
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`Servidor listo en ${url}`);
  dbInit();
});
