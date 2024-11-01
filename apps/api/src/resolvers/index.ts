import userResolvers from "./note";
import noteResolvers from "./note";
import scarlarResolvers from "./scalar";
import { mergeResolvers } from "@graphql-tools/merge";

export default mergeResolvers([scarlarResolvers, userResolvers, noteResolvers]);
