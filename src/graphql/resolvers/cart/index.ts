import { Resolvers } from '@apollo/client';
import { parse, ValiError } from 'valibot';
import { CheckoutInput } from '@/graphql/generated';
import { checkoutSchema } from '@/schema';

const resolvers: Resolvers = {
  Mutation: {
    submitOrder: async (_, { input }: { input: CheckoutInput }) => {
      try {
        parse(checkoutSchema, input);

        console.log('🚀 ~ submitOrder: ~ input:', input);

        return { success: true };
      } catch (error) {
        if (error instanceof ValiError) {
          const newErrors: Record<string, string> = {};

          error.issues.forEach((issue) => {
            const path = issue.path?.[0].key as string;
            newErrors[path] ||= issue.message;
          });

          return { success: false, errors: newErrors };
        }
      }
    },
  },
};

export default resolvers;
