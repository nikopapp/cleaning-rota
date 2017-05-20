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

        db.run("DROP TABLE IF EXISTS CLEANTYPE");
        console.log("CLEANLOG deleted");

        console.log("Creating TABLE RESIDENT");
         db.run("CREATE TABLE RESIDENT ("+
         "id INT,"+
         "name TEXT,"+
         "avatarUrl TEXT"+
         ")");
         console.log("TABLE RESIDENT created");

         console.log("Creating TABLE CLEANTYPE");
          db.run("CREATE TABLE CLEANTYPE ("+
          "id INT,"+
          "name TEXT,"+
          "avatarUrl TEXT"+
          ")");
          console.log("TABLE CLEANTYPE created");

         console.log("Creating CLEANLOG");
         db.run("CREATE TABLE CLEANLOG ("+
         "id INT PRIMARY KEY,"+
         "weeknum TEXT,"+
         "cleanTypeId INT,"+
         "residentId INT,"+
         "FOREIGN KEY (residentId) REFERENCES RESIDENT (id),"+
         "FOREIGN KEY (cleanTypeId) REFERENCES CLEANTYPE (id)"+
         ")");
// =====================================================================
         console.log("populating...");
         var stmt = db.prepare("INSERT INTO RESIDENT VALUES (?,?,?)");
         for (var i = residents.length-1; i >=0 ; i--) {
              var res = residents[i];
              console.log(res.id,res.name,res.avatarUrl);
             stmt.run(res.id,res.name,res.avatarUrl);
         }
         stmt.finalize();
         stmt = db.prepare("INSERT INTO CLEANTYPE VALUES (?,?,?)");
         for (var i = cleanTypes.length-1; i >=0 ; i--) {
              var clType = cleanTypes[i];
              console.log(clType.id,clType.name,clType.avatarUrl);
             stmt.run(clType.id,clType.name,clType.avatarUrl);
         }
         stmt.finalize();

      db.close();
    });
}

function erro(e) { if (e) throw e; }
const residents = [
  {id:1,name:"Bea",avatarUrl:"https://scontent-lhr3-1.xx.fbcdn.net/v/t1.0-1/c0.0.160.160/p160x160/13912758_10154029673679261_6057587684232910356_n.jpg?oh=67c5970b1ebb5e5f47b53b941334201c&oe=59C03C36"},
  {id:2,name:"Elva",avatarUrl:"https://scontent-lhr3-1.xx.fbcdn.net/v/t1.0-1/p200x200/16938510_1869872769893541_8007572245070887840_n.jpg?oh=84d6a3488f51621e297388464bbc54f0&oe=59B77289"},
  {id:3,name:"Maria",avatarUrl:"https://www.gravatar.com/avatar/00000000000000000000000000000000?d=retro&f=y"},
  {id:4,name:"Nikos",avatarUrl:"https://scontent-lhr3-1.xx.fbcdn.net/v/t1.0-1/c39.0.100.100/p100x100/11027784_1381519218836551_4025787695941542460_n.jpg?oh=b7377cdb418f0c0c626f84a66216020c&oe=59AAC262"},
  {id:5,name:"Simone",avatarUrl:"https://scontent-lhr3-1.xx.fbcdn.net/v/t1.0-1/c132.36.456.456/s100x100/215818_103867606367022_5805078_n.jpg?oh=47f309074fb2d1ed1e6ddec9968a0162&oe=59778FC0"}
]
const cleanTypes = [
  {id:1,name:"Kitchen",avatarUrl:""},
  {id:2,name:"Main bathroom",avatarUrl:""},
  {id:3,name:"Auxiliary bathroom",avatarUrl:""},
  {id:4,name:"Livingroom and hallways",avatarUrl:""}
]
