import userResolvers from "./user";
import noteResolvers from "./note";
import { mergeResolvers } from "@graphql-tools/merge";

export default mergeResolvers([userResolvers, noteResolvers]);
