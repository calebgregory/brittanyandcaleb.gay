const stage = process.env.STAGE

export const config = {
  stage,
  region: process.env.AWS_REGION || 'us-east-1',
  dyn_table_name: process.env.BC_APP_TABLE_NAME || `bc-gay-backend-v0-${stage}-table-BCApp-v0`,
  lambda_fn_name: process.env.AWS_LAMBDA_FUNCTION_NAME || '',
}
