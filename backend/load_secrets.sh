#!/bin/bash

THIS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

get_from_secret_file() {
  cat "$THIS_DIR/../secrets/google_app.json" | jq -r "$1"
}

export GOOGLE_CLIENT_ID="$(get_from_secret_file '.web.client_id')"
export GOOGLE_CLIENT_SECRET="$(get_from_secret_file '.web.client_secret')"
