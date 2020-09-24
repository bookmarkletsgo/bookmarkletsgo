#!/usr/bin/env bash

npm run build:prod
cp public/bookmarklets.html ../bookmarkletsgo.github.io/index.html
cp public/bookmarklets.html ../bookmarkletsgo.github.io/bookmarklets.html

cd ../bookmarkletsgo.github.io/

git add --all
git commit --amend --no-edit --reset-author
git push --force
