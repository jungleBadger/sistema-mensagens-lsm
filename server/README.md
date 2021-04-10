

### App stack

1. Node.js v14.16.1+
2. Express JS framework
3. IBM DB2
4. ESLint
5. Gulp.js


### Building the app

The instructions below considers the `server` folder as working directory.

#### 1. Configure environment variables

Create a `.env` file and populate the following variables

```dotenv
LOCAL_HTTPS=
APP_SECRET=
DB2_DB=
DB2_HOST=
DB2_PORT=
DB2_UID=
DB2_PASSWORD=
DB2_SCHEMA=
```

#### 2. Install dependencies

```shell
npm install
```

#### 3. Validate the code

```shell
npm run lint
```

---

### Running the app


#### Run in development mode

* NODE_ENV set to `development`
* Watcher enabled

```shell
npm run start:dev
```


#### Run in production mode

* NODE_ENV set to `production`

```shell
npm run start:prod
```

---


### Testing the app

#### Execute test instruction


```shell
npm run test
```

---

### Automated documentation

#### Swagger docs

Generate swagger documentation based on JSDoc strings

```shell
npm run documentation:swagger
```


#### JSDoc docs

Generate JSDoc documentation based on JSDoc strings

```shell
npm run documentation:js
```