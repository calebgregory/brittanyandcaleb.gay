import config_json from './__generated__.json'

const sign_in_url = [
  'https://',
  config_json.user_pool_client_hosted_ui_domain,
  '.auth.',
  config_json.region,
  '.amazoncognito.com/oauth2/authorize?client_id=',
  config_json.user_pool_client_id,
  '&response_type=code&scope=email+openid+phone+profile&redirect_uri=',
  encodeURIComponent(window.location.origin),
].join('')

const token_url = [
  'https://',
  config_json.user_pool_client_hosted_ui_domain,
  '.auth.us-east-1.amazoncognito.com/oauth2/token',
].join('')

export const config = {
  ...config_json,
  sign_in_url,
  token_url,
}
