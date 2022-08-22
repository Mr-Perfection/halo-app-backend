import { objectType, extendType, nonNull, stringArg } from "nexus";
import * as bcrypt from "bcryptjs";
import {
  isValidPassword,
  setTokens,
} from "../utils/auth";

export const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.nonNull.string("accessToken");
    t.nonNull.string("refreshToken");
    t.nonNull.field("user", {
      type: "User",
    });
  },
});

// TODO: need to improve security by creating a refresh token.
export const AuthMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("login", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(parent, args, context) {
        const user = await context.prisma.user.findFirstOrThrow({
          where: { email: args.email },
        });

        const valid = await bcrypt.compare(args.password, user.password);
        if (!valid) {
          throw new Error("Invalid password");
        }

        return { ...setTokens(user), user };
      },
    });
    t.nonNull.field("signup", {
      type: "AuthPayload",
      args: {
        customerSlug: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        firstName: nonNull(stringArg()),
        lastName: nonNull(stringArg()),
        role: stringArg(),
      },
      async resolve(parent, args, context) {
        const { customerSlug, email, firstName, lastName, role, password } =
          args;
        if (!isValidPassword(password)) {
          throw new Error(
            "Min 8 letter password, with at least a symbol, upper and lower case letters and a number."
          );
        }

        const customer = await context.prisma.customer.findUniqueOrThrow({
          where: {
            slug: customerSlug,
          },
        });

        // Encrypt password.
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await context.prisma.user.create({
          data: {
            customerId: customer.id,
            email,
            firstName,
            lastName,
            password: hashedPassword,
          },
        });

        return { ...setTokens(user), user };
      },
    });
  },
});
