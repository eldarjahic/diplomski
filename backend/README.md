# How to run backend

## Docker

Backend is ran in a docker container as well as the postgres database.
In order to run the backend you need to run the following commands:

1. Make sure you are in the `backend` directory

```bash
cd backend
```

2. Run the docker container

```bash
docker compose up --build
```

# Running migrations

When changing anything in the db schema we have to apply the changes via migrations.

1. Make sure the backend is running (db mainly)
2. Run the command for generating the migration

```bash
npm run migration:generate -- src/migration/<migration-name>
```

3. You can see the generated migration in the migrations folder
4. Run the migration (this will change the db)

```bash
npm run migration:run
```
