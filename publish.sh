#!/bin/bash
rm version.js 2>/dev/null
git commit -a && echo K2.version=\"`git log -n 1 --pretty="%H"`\"\; && grunt release
