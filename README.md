# Convalant Telegram Bot Build with TypeORM

## Introduction 
Telegram bot to measure happiness, gather feedbacks and give lots of praises ;)

## Quick Start

### Steps to run this project:

1. Setup database settings inside `ormconfig.json` file
2. Run `npm start` command to start the program and initialize the database structure

### Accessing the database 

1. Execute the following command ```sqlite3 data/convalant.db```

### Data Migration (For Production)
In practice, however, we do not to unconditionally synchronize the database to the entities.Instead we use migrations, each only running once and in order, to initialize and maintain the database over time. TypeORM is able to automatically generate migration files with schema changes you made. 

To generate migration scripts if there are changes to the schema , run the following command

 ``` npm run typeorm-migration-generate ```

 To run migration ordered by their timestamps

 ``` npm run typeorm-migration-run ```