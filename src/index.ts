import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "../defs/defs";
import { resolvers } from "../controllers/resolvers";
import dbInit from "../db/mongodb";
const server = new ApolloServer({ typeDefs, resolvers });

(async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  dbInit();
  console.log(`Server ready at ${url}`);
})();
