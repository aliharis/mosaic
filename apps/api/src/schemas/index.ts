import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import path from "path";

const typesArray = loadFilesSync(path.join(__dirname, "./types"), {
  extensions: ["graphql"],
});

const resolversArray = loadFilesSync(path.join(__dirname, "../resolvers"));

export const schema = makeExecutableSchema({
  typeDefs: mergeTypeDefs(typesArray),
  resolvers: mergeResolvers(resolversArray),
});
