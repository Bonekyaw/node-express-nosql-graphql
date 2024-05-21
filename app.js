require("dotenv").config();
const express = require("express");
// const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const rateLimit = require("express-rate-limit");
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

app.use(helmet());

app.use(express.json()); // application/json
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());
app.use(cors());
// app.options("*", cors());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 15,    // Limit each IP to 15 requests per `window` (here, per 1 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // skipSuccessfulRequests: true,      // This is useful for auth check. If request is successful, it never limit.
});
app.use(limiter);

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
