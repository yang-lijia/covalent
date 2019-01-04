const path = require('path');

module.exports = {
   "type": "sqlite",
   "database": `${path.resolve(__dirname, "data/covalent.db")}`,
   "synchronize": true,
   "migrationsRun": false,
   "logging": true,
   "entities": [
      "src/entity/**/*.ts"
   ],
   "migrations": [
      "dist/migration/**/*.js"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration"
   }
}
