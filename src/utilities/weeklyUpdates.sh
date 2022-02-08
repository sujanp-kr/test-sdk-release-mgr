# This must be run inside from a package.json script

function installJq {
  HOMEBREW_NO_AUTO_UPDATE=1 brew install jq && clear && echo "Successfully installed jq"
}

# Install jq if you don't already have it
which jq || installJq

USER_PATH=".kat/"
rm -rf "$USER_PATH"
mkdir "$USER_PATH"

curl -H "Authorization: token ${ACCESS_TOKEN}" \
  -H "Accept: application/vnd.github.v3+json" \
  -L https://api.github.com/repos/krogertechnology/kat-scenario-poet/releases/latest |
  jq ".assets[0].url" |
  xargs -n 1 curl -L -H "Authorization: token ${ACCESS_TOKEN}" \
    -H "Accept: application/octet-stream" \
    -o "${USER_PATH}scenario-poet-cli-latest.tar"

tar -xf "${USER_PATH}scenario-poet-cli-latest.tar" -C "${USER_PATH}"

SCHEMA_REGISTRY_PATH="${USER_PATH}schema-registry"
rm -rf "$SCHEMA_REGISTRY_PATH"
git clone --quiet --depth 1 "https://${ACCESS_TOKEN}@github.com/krogertechnology/schema-registry.git" "$SCHEMA_REGISTRY_PATH"

"${USER_PATH}scenario-poet-cli/bin/scenario-poet-cli" --root "$SCHEMA_ROOT" --language typescript "$SCHEMA_REGISTRY_PATH" --output "${USER_PATH}OUTPUT_DIR"
rm -rf "${WEEKLY_UPDATES_DESTINATION}/schema"
cp -r "${USER_PATH}OUTPUT_DIR/schema" "${WEEKLY_UPDATES_DESTINATION}"
