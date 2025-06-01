#!/bin/sh

# Changing the type in package,json from module to commonjs,
# this script should only be used in docker for esbuild build
sed -i 's/"type": "module"/"type": "commonjs"/' package.json
