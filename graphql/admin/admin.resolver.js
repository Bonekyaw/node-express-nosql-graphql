require("dotenv").config();

const Admin = require("../../models/admin");

const { composeResolvers } = require("@graphql-tools/resolvers-composition");
const asyncHandler = require("express-async-handler");
// const { body, validationResult } = require("express-validator");
// const { v4: uuidv4 } = require("uuid");
const validator = require("validator");
const { GraphQLError } = require("graphql");

const { checkAdminExist } = require("../../utils/check");
const isAuth = require("../../utils/isAuth");
const { offset, noCount, cursor } = require("../../utils/paginate");
const authorise = require("../../utils/authorise");

const resolvers = {
  Mutation: {
    uploadProfile: asyncHandler(async (parent, args, context, info) => {
      let admin = info.admin;
      let imageUrl = args.userInput.imageUrl;
      if (
        validator.isEmpty(imageUrl.trim()) ||
        !validator.matches(imageUrl, "^uploads/images/.*.(png|jpg|jpeg)$")
      ) {
        throw new GraphQLError("This image url is invalid.", {
          extensions: {
            code: "BAD REQUEST",
            http: { status: 400 },
          },
        });
      }

      imageUrl = validator.escape(imageUrl);

      admin.profile = imageUrl;
      await admin.save();

      return {
        message: "Successfully uploaded your profile picture.",
        imageUrl: validator.unescape(imageUrl), // Don't forget to unescape.
      };
    }),
    //
  },
  Query: {
    // Pagination Query
    paginateAdmins: asyncHandler(async (parent, args, context, info) => {
      let { page, cursors, limit } = args;

      const filters = {
        status: "active",
      };
      const sort = { createdAt: -1 };   // offset
      // const sort = "-createdAt";     // error will be in offset

      return offset(Admin, page, limit, filters, sort);
      // return noCount(
      //   Admin, page, limit, filters, sort
      // );
      // return cursor(Admin, cursors, limit, filters, sort);
    }),
  },
};

// Resolvers Composition like auth middleware in REST

const isAuthenticated = () => (next) => (parent, args, context, info) => {
  checkAdminExist(context.authHeader);
  let token = context.authHeader.split(" ")[1]; // Hey take care!
  if (validator.isEmpty(token.trim()) || !validator.isJWT(token)) {
    throw new GraphQLError("Token must not be invalid.", {
      extensions: {
        code: "BAD REQUEST",
        http: { status: 400 },
      },
    });
  }
  token = validator.escape(token);
  const adminId = isAuth(token);
  info.adminId = adminId;

  return next(parent, args, context, info);
};

const hasRole = (...role) => (next) =>
  asyncHandler(async (root, args, context, info) => {
    let adminId = info.adminId;
    const admin = await Admin.findById(adminId);
    checkAdminExist(admin);
    authorise(false, admin, ...role);
    info.admin = admin;

    return next(root, args, context, info);
  });

const resolversComposition = {
  "Mutation.uploadProfile": [isAuthenticated(), hasRole("user")],
  "Query.paginateAdmins": [isAuthenticated(), hasRole("user")],
};

const composedResolvers = composeResolvers(resolvers, resolversComposition);
module.exports = composedResolvers;

// const resolversComposition = {
//   'Query.myQuery': [isAuthenticated(), hasRole('EDITOR')]
// }
