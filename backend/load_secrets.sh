#!/bin/bash

THIS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

STAGE="${1:-devl}"

get_from_secret_file() {
  cat "$THIS_DIR/../secrets/$1" | jq -r "$2"
}

export SES_EMAIL_RECIPIENTS="$(get_from_secret_file "ses_emails.json" '.recipients')"
export GOOGLE_CLIENT_ID="$(get_from_secret_file "google_app.$STAGE.json" '.web.client_id')"
export GOOGLE_CLIENT_SECRET="$(get_from_secret_file "google_app.$STAGE.json" '.web.client_secret')"
