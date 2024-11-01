import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs as scalarTypeDefs } from "graphql-scalars";
import path from "path";

const typesArray = loadFilesSync(path.join(__dirname, "types"), {
  extensions: ["graphql"],
  recursive: true,
});

const resolversArray = loadFilesSync(path.join(__dirname, "../resolvers"));

export const schema = makeExecutableSchema({
  typeDefs: mergeTypeDefs([scalarTypeDefs, ...typesArray]),
  resolvers: mergeResolvers(resolversArray),
});
