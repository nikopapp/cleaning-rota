const express     = require("express");
const bodyParser  = require("body-parser");

const compression   = require('compression');


const sql = require("sqlite3").verbose();

var db = new sql.Database("database/test.sqlite3");
const statusCode = {"notFound": 404, "ok": 200, "created": 201};
module.exports = function(port, middleware, callback) {
   //------------------ descriptions
   const residents = [];
   const cleanlog = [];
   const cleanTypes = [];
   // db Intstantiation
   // dbCreate.startup(db);
   //  db.serialize(function(){
     loadDB();
    //  });
   function loadDB(){
     residents.length=0;
     cleanTypes.length=0;
     cleanlog.length=0;
     db.each("SELECT * FROM RESIDENT ORDER BY id", function(err, row) {
console.log(row);
       residents.push({id:row.id,name: row.name,avatarUrl: row.avatarUrl});
     });

     db.each("SELECT * FROM CLEANTYPE", function(err, row) {
       console.log(row);
       cleanTypes.push({id:row.id,name: row.name,avatarUrl: row.avatarUrl});
     });
     db.each("SELECT * FROM CLEANLOG ORDER BY weeknum DESC", function(err, row) {
console.log(row);
       cleanlog.push({id:row.id,weeknum: row.weeknum, cleanTypeId:row.cleanTypeId, residentId:row.residentId});
     });

   }

  //  --------------------------------------------------------------------------
  //  --------------------------------ExpressAppStarts--------------------------
  //  --------------------------------------------------------------------------
  //  --------------------------------------------------------------------------
    var app = express();
    if (middleware) {
        app.use(middleware);
    }

    function shouldCompress (req, res) {
      if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
      }

      // fallback to standard filter function
      return compression.filter(req, res)
    }
    app.use(compression({filter: shouldCompress}))
    app.use(bodyParser.json());
    app.use(require('body-parser').urlencoded({ extended: true }));


// -------------------------MyLOG-----------------------------------------------
    // app.use(function(req,res,next) {
    //   console.log(req.method, req.url);
    //   next();
    // });

// ----------------------------------------------------------------------

    var status = {"notFound": 404, "ok": 200, "created": 201};
    app.use(express.static("public"));

    app.get("/api/residents",function(req,res){
      res.json(residents);
    });
    app.get("/api/cleanlog",function(req,res){
      res.json(cleanlog);
    });
    app.get("/api/cleantypes", function(req,res){
      res.json(cleanTypes);
    });
    app.post("/api/cleanlog", function(req,res) {
      console.log(req.body);
      const stmt = db.prepare("INSERT INTO CLEANLOG VALUES (?,?,?,?)");
      console.log(null,""+Date.now(),req.body.cleanTypeId,req.body.id);
      stmt.run(null,""+Date.now(),req.body.cleanTypeId,req.body.id);
      stmt.finalize();
      loadDB();
      res.json(cleanTypes);
      // console.log(req);
    });

function handleError(err,code,res){
  if (err){
    return res.status(code).send(err);
  }
}



    var server = app.listen(port, callback);

    // We manually manage the connections to ensure that they're closed when calling close().
    var connections = [];
    server.on("connection", function(connection) {
        connections.push(connection);
    });

    return {
        close: function(callback) {
            connections.forEach(function(connection) {
                connection.destroy();
            });
            db.close();
            server.close(callback);
        }
    };
};
