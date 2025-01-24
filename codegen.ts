import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: './src/graphql/schema.graphql',
  documents: './src/graphql/**/*.graphql',
  generates: {
    'src/graphql/generated.tsx': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        avoidOptionals: {
          field: true,
          inputValue: false,
          object: false,
          defaultValue: false,
        },
        strictScalars: true,
        preResolveTypes: false,
        scalars: {
          Date: 'number',
          DateTime: 'string',
          JSON: 'object',
        },
      },
    },
  },
};

export default config;
