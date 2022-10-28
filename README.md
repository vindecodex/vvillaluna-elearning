<div align="center">
<h1>E-Learning API</h1>
</div>

## Setup
After clonning the project

##### Step 1
cd inside root directory of the project and copy `.env.dev.sample` and named it to `.env`
```bash
cp .env.dev.sample .env
```

for the **smtp** part of the environment variables, this project is using **[sendgrid](https://sendgrid.com/)**.
All of the fields will be provided when integrating using **[smtp relay](https://app.sendgrid.com/guide/integrate/langs/smtp)** on sendgrid account.
```
MAILER_HOST=smtp.sendgrid.net // default host
MAILER_USER=apikey // default user
MAILER_PASSWORD=
MAILER_FROM=
```

##### Step 2
Run docker compose with `~$: docker compose up`.

###### Alternatively running without docker
Requirements:
- Redis v6+
- Postgres v14+
- node v14+

Running the API server:
- npm i
- npm run start:dev


## Testing

##### Unit Testing
Run unit test: `npm t`

Run unit test with coverage: `npm run test:cov`

##### E2E Testing
Working In Progress

##### Api Documentation with Swagger
Working In Progress
