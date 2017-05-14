const sql = require("sqlite3").verbose();
const dbCreate = require("./create");

var db = new sql.Database("database/test.sqlite3");

dbCreate.startup(db);
