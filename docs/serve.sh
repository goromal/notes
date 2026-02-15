#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

python "$SCRIPT_DIR/../scripts/generate_docs.py"

cd "$SCRIPT_DIR"
nix-shell -p mdbook --run "mdbook serve --port 4444 --hostname 0.0.0.0 --open"
