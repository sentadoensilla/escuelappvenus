
#!/bin/bash
FECHA=$(date +"%Y-%m-%d_%H-%M");
cd "$(pwd)"
#tar -cvjf "$FECHA"_front_developer.tar.bz2 --exclude=".env*" --exclude="./src/main.js" --exclude="./vue.config.js" --exclude="./src/store" --exclude="./dist" --exclude="./.git" --exclude="./public/archivos" --exclude="./node_modules" .
tar -cvjf "$FECHA"_venus_development.tar.bz2 --exclude="./dist" --exclude="./.git" --exclude="./public/archivos" --exclude="./node_modules" .