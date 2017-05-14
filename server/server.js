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
   // db Intstantiation
   // dbCreate.startup(db);
   //  db.serialize(function(){
     loadDB();
    //  });
   function loadDB(){
     db.each("SELECT * FROM RESIDENT ORDER BY id", function(err, row) {
       residents.push({id:row.id,name: row.name});
     });
     db.each("SELECT * FROM CLEANLOG ORDER BY weeknum DESC", function(err, row) {
       cleanlog.push({id:row.id,weeknum: row.weeknum, residentId:row.residentId});
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

    app.get("/api/residents",function(req,res){
      res.json(residents);
    });
    app.get("/api/cleanlog",function(req,res){
      res.json(cleanlog);
    });


function handleError(err,code,res){
  if (err){
    return res.status(code).send(err);
  }
}


    function getTodo(id,list) {
        return _.find(list, function(todo) {
            return todo.id === id;
        });
    }
    function getComplete() {
        return todos.filter(function(todo) {
            return todo.isComplete;
        });
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
