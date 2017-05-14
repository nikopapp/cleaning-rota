//this creates a database for use by server.js
"use strict";
var sql = require("sqlite3").verbose();
module.exports = {
  startup:startup
}
// var db = new sql.Database("../testCreate.sqlite3");
// db.serialize(startup);

function startup(db) {
    const err = erro;
    db.serialize(function(){

        db.run("DROP TABLE IF EXISTS RESIDENT");
        console.log("RESIDENT deleted");

        db.run("DROP TABLE IF EXISTS CLEANLOG");
        console.log("CLEANLOG deleted");

        console.log("Creating TABLE RESIDENT");
         db.run("CREATE TABLE RESIDENT ("+
         "id INT,"+
         "name TEXT"+
         ")");
         console.log("TABLE RESIDENT created");

         console.log("Creating CLEANLOG");
         db.run("CREATE TABLE CLEANLOG ("+
         "id INT,"+
         "weeknum TEXT,"+
         "residentId INT"+
         ")");
// =====================================================================
         console.log("populating...");
         var stmt = db.prepare("INSERT INTO RESIDENT VALUES (?,?)");
         for (var i = residents.length-1; i >=0 ; i--) {
              var res = residents[i];
              console.log(res.id,res.name);
             stmt.run(res.id,res.name);
         }
         stmt.finalize();
      db.close();
    });
}

function erro(e) { if (e) throw e; }
const residents = [
  {id:1,name:"Bea"},
  {id:2,name:"Elva"},
  {id:3,name:"Maria"},
  {id:4,name:"Nikos"},
  {id:5,name:"Simone"}
]
