FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml* ./
COPY .npmrc .

RUN npm i -g pnpm@8
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @zimtrades/api build

EXPOSE 4000
CMD ["node", "dist/main.js"]
