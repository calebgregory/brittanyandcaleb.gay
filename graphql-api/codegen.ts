import type { CodegenConfig } from '@graphql-codegen/cli'

const typescript_config = {
  immutableTypes: false,
  skipTypename: true,
  avoidOptionals: {
    field: true,
    inputValue: false,
  },
  scalars: {
    AWSEmail: 'string',
    AWSPhone: 'string',
    AWSDateTime: 'string',
    AWSURL: 'string',
  },
}

const config: CodegenConfig = {
  schema: ['./appsync-schema/internal.graphql', './aws-appsync-directives.graphql'],
  generates: {
    'types.ts': {
      plugins: ['typescript'],
      config: typescript_config,
    },
    'test-builders.ts': {
      plugins: ['typescript', 'graphql-codegen-typescript-mock-data'],
      config: typescript_config,
    },
  },
}

export default config
