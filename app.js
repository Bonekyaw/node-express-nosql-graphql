require("dotenv").config();
const express = require("express");
// const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const { createHandler } = require("graphql-http/lib/use/express");
const { ruruHTML } = require("ruru/server");
const path = require("path");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { mergeResolvers } = require("@graphql-tools/merge");
const { loadFilesSync } = require("@graphql-tools/load-files");
const { loadSchemaSync } = require("@graphql-tools/load");
const { GraphQLFileLoader } = require("@graphql-tools/graphql-file-loader");

// const schema = require('./graphql/schema');
// const typeDefs = require('./graphql/schema');
// const resolver = require('./graphql/resolver');

const app = express();

app.use(express.json()); // application/json
// app.use(bodyParser.json());

const typeDefs = loadSchemaSync("./**/**/*.graphql", {
  loaders: [new GraphQLFileLoader()],
});
const resolverFiles = loadFilesSync(path.join(__dirname, "./**/**/*.resolver.*"));
const resolvers = mergeResolvers(resolverFiles);

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create and use the GraphQL handler.
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: resolvers,
  })
);

// Serve the GraphiQL IDE.
app.get("/", (_req, res) => {
  res.type("html")
  res.end(ruruHTML({ endpoint: "/graphql" }))
})

mongoose
.connect(process.env.MONGO_URI)   // Localhost - "mongodb://127.0.0.1/lucky"
// .connect(process.env.MONGO_URL)   // Mogodb atlas
.then((result) => {
    app.listen(8080); // localhost:8080
    console.log("Sucessfully connected to mongodb Atlas");
  })
  .catch((err) => console.log(err));
