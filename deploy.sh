npm run build

cp -r .next/static .next/standalone/.next

cp package-lock.json .next/standalone/package-lock.json

cd .next/standalone && npx freestyle deploy --web server.js --domain wtfa.swerdlow.dev
