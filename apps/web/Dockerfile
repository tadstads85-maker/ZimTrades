FROM node:18-alpine
WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml* ./
COPY .npmrc .

RUN npm i -g pnpm@8
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @zimtrades/web build

EXPOSE 3000
CMD ["pnpm", "--filter", "@zimtrades/web", "start"]
