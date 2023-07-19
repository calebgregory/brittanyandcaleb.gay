#!/bin/bash

THIS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

get_from_secret_file() {
  cat "$THIS_DIR/../secrets/$1" | jq -r "$2"
}

cat <<EOM > src/config/__generated__.json
{
  "region": "us-east-1",
  "google_client_id": "$(get_from_secret_file 'google_app.json' '.web.client_id')",
  "user_pool_id": "$(get_from_secret_file 'bc_gay_app.json' '.user_pool_id')",
  "user_pool_client_id": "$(get_from_secret_file 'bc_gay_app.json' '.user_pool_client_id')",
  "user_pool_client_hosted_ui_domain": "$(get_from_secret_file 'bc_gay_app.json' '.user_pool_client_hosted_ui_domain')"
}
EOM

echo "done"