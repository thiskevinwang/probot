#!/bin/bash
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# https://docs.github.com/en/developers/apps/building-github-apps/authenticating-with-github-apps#verifying-private-keys
verify_key() {
  FILE=$1
  openssl rsa -in ${FILE} -pubout -outform DER | openssl sha256 -binary | openssl base64
}

FILE=$(find . -type f -name '*.pem')

[[ "$FILE" ]] && verify_key $FILE || echo "${RED}✖︎ No file found${NC}"
