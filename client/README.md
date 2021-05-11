### App stack

1. Node.js v14.16.1+
2. Vue.js v3
3. Fontawesome v6
4. Greensock v3
5. ESLint
6. Gulp.js

### Building the app

The instructions below considers the `client` folder as working directory.

#### 1. Configure environment variables

Create a `.npmrc` file as demonstrated below, populating the required variables.

```bash
FA_KEY=<YOUR_FONTAWESOME_KEY>
GS_KEY=<YOUR_GREENSOCK_KEY>

touch .npmrc

echo //npm.fontawesome.com/:_authToken=${FA_KEY} >> .npmrc
echo @fortawesome:registry=https://npm.fontawesome.com/ >> .npmrc

echo //npm.greensock.com/:_authToken=${GS_KEY} >> .npmrc
echo @gsap:registry=https://npm.greensock.com >> .npmrc
```

#### 2. Install dependencies

```shell
npm install
```

#### 3. Build all modules

* NODE_ENV set to `development`
* Concurrent build

```shell
npm run build:all
```

#### 3. Build admin and main modules separately

* NODE_ENV set to `development`
* Single build

```shell
npm run build:admin
npm run build:main
```


#### 4. Build modules with watcher enabled

* NODE_ENV set to `development`
* Single build
* Watcher enabled

```shell
npm run build:admin:dev
npm run build:main:dev
```


#### 4. Build modules with production build

* NODE_ENV set to `production`
* Concurrent and Single builds

```shell
npm run build:all:prod
npm run build:main:prod
```

---

### Testing the app

#### Execute test instruction


```shell
npm run test
```

---
