#!/bin/bash

# Colors: https://stackoverflow.com/questions/5947742/how-to-change-the-output-color-of-echo-in-linux
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Find private key file
# TODO: Handle case where there is more than 1
FILE=$(find . -type f -name '*.pem')

# Note: Ternary Syntax
# [[ "$FILE" ]] && echo "${GREEN}✔ File foundd${NC}" || echo "${RED}✖︎ No file found${NC}"

if [ -z "$FILE" ]
then
    # No file was found.
    echo "${RED}✖︎ No .pem file was found."
    echo "Exiting${NC}"
    exit 1
else
    # File was found.
    echo "${GREEN}✔ File found"
    echo "Copying PRIVATE_KEY to .env...${NC}"
    # Write string to .env
    echo "PRIVATE_KEY='`cat $FILE`'\n" >> .env
    echo "Ok"
    exit 0
fi

