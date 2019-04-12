const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
 
// Connection configurations
const mc = mysql.createConnection({
  host: 'cs358.cis.valpo.edu',
  user: 'hesse',
  password: '358hesse',
  database: 'hesse'
});
 
// Connect to database
mc.connect(); 

// For getting post data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Default route
app.get('/api/', function (req, res) {
  return res.json({ message: 'hello' })
});

// Add a user to the database, or update their information if their entry already exists
// should be called right when someone logs in
app.post('/api/user', function (req, res, next) {

  var userId = req.body.id;
  var name = req.body.name;
  var email = req.body.email;

  // check for required fields
  if (!userId || !name || !email) {
    return res.status(400).json({ message: 'Missing information.' });
  }

  // set up the query
  var query = `INSERT INTO users (id, name, email)
               VALUES (?,?,?)
               ON DUPLICATE KEY UPDATE name=VALUES(name)`;
  
  // run the query
  mc.query(query, [userId, name, email], function (error, results, fields) {
    if (error) throw error;
    return res.json({ data: results, message: 'User information stored successfully.' });
  });

});
 
// Retrieve all shifts for the listings page
// Date is formatted like "Wednesday March 20 2019"
app.get('/api/shifts', function (req, res) {

  // set up the query
  var query = `SELECT s.id,
                      DATE_FORMAT(s.shiftDate, "%W %M %e %Y") AS shiftDate,
                      s.shiftTime,
                      up.name AS postedBy, 
                      uc.name AS coveredBy
               FROM shifts s
               LEFT JOIN users up ON up.id=s.postedBy 
               LEFT JOIN users uc ON uc.id=s.coveredBy`;

  // run the query
  mc.query(query, function (error, results, fields) {
    if (error) { throw error; }
    return res.json({ data: results });
  });

});

// Retrieve shifts posted by the given user
app.get('/api/postedShifts/:id', function (req, res) {

  var userId = req.params.id;
  
  // set up the query
  var query = `SELECT s.id,
                      DATE_FORMAT(s.shiftDate, "%W %M %e %Y") AS shiftDate, 
                      s.shiftTime, 
                      up.name AS postedBy,
                      uc.name AS coveredBy
	       FROM shifts s 
	       LEFT JOIN users up ON up.id=s.postedBy 
               LEFT JOIN users uc ON uc.id=s.coveredBy 
               WHERE up.id=?`;

  // run the query
  mc.query(query, [userId], function (error, results, fields) {
    if (error) { throw error; }
    return res.json({ data: results });
  });

});

// Retrieve shifts covered by the given user
app.get('/api/coveredShifts/:id', function (req, res) {

  var userId = req.params.id;

  // set up the query
  var query = `SELECT s.id,
                      DATE_FORMAT(s.shiftDate, "%W %M %e %Y") AS shiftDate, 
                      s.shiftTime, 
                      up.name AS postedBy, 
                      uc.name AS coveredBy 
               FROM shifts s 
               LEFT JOIN users up ON up.id=s.postedBy 
               LEFT JOIN users uc ON uc.id=s.coveredBy 
               WHERE uc.id=?`;

  // run the query
  mc.query(query, [userId], function (error, results, fields) {
    if (error) { throw error; }
    return res.json({ data: results });
  });

});

// Retrieve shift by id
// Date is formatted like "Wednesday March 20 2019"
app.get('/api/shift/:id', function (req, res) {

  var shiftId = req.params.id;

  // set up the query
  var query = `SELECT s.id, 
                      s.createdAt, 
                      DATE_FORMAT(s.shiftDate, "%W %M %e %Y") AS shiftDate, 
                      s.shiftTime, 
                      up.name AS postedBy, 
                      uc.name AS coveredBy, 
                      s.helpSession, 
                      s.majorPreference, 
                      s.yearPreference, 
                      s.comments 
               FROM shifts s 
               LEFT JOIN users up ON up.id=s.postedBy 
               LEFT JOIN users uc ON uc.id=s.coveredBy 
               WHERE s.id=?`;

  // run the query
  mc.query(query, [shiftId], function (error, results, fields) {
    if (error) throw error;
    return res.json({ data: results[0] });
  });

});

// Add a new shift
app.post('/api/shift', function (req, res, next) {

  var shiftDate = req.body.shiftDate;
  var shiftTime = req.body.shiftTime;
  var postedBy = req.body.postedBy;
  var helpSession = req.body.helpSession;
  var majorPreference = req.body.majorPreference;
  var yearPreference = req.body.yearPreference;
  var comments = req.body.comments;

  // check for required fields
  if (!shiftDate || !shiftTime || !postedBy || !helpSession || !majorPreference || !yearPreference) {
    return res.status(400).json({ message: 'Missing information.' });
  }

  // set up the query
  var query = `INSERT INTO shifts (shiftDate, shiftTime, postedBy, helpSession, majorPreference, yearPreference, comments) 
               VALUES (?,?,?,?,?,?,?)`;

  // run the query
  mc.query(query, [shiftDate, shiftTime, postedBy, helpSession, majorPreference, yearPreference, comments], function (error, results, fields) {
    if (error) throw error;
    return res.json({ data: results, message: 'New shift has been created successfully.' });
  });

});

// Cover a shift
// Updates the shift's "covered by" field
app.put('/api/shift', function (req, res) {

  var shiftId = req.body.id;
  var coveredBy = req.body.coveredBy;

  // check for required fields  
  if (!shiftId || !coveredBy) { 
    return res.status(400).json({ message: 'Missing information.' });
  }
  
  // set up the query
  var query = `UPDATE shifts 
               SET coveredBy=? 
               WHERE id=?`;

  // run the query 
  mc.query(query, [coveredBy, shiftId], function (error, results, fields) {
    if (error) throw error;
    return res.json({ data: results, message: 'Shift has been updated successfully.' });
  });

}); 

// Delete a shift
app.delete('/api/shift', function (req, res) {

  var shiftId = req.body.id;
  var deletedBy = req.body.deletedBy;

  // check for required fields
  if (!shiftId || !deletedBy) {
    return res.status(400).json({ message: 'Missing information.' });
  }

  // need to check that the user has permission to delete the shift
  // they need to be either the person who posted the shift, or an admin
  var hasPermission = false;

  // see https://stackoverflow.com/questions/31875621/how-to-properly-return-a-result-from-mysql-with-node
  // basically we need to make the query that checks the permissions runs before
  // the query that actually deleted the record
  function checkPermission(callback) {

    // this query will only find something if they posted the shift
    // and if they're an admin
    var permissionQuery = `SELECT postedBy 
                           FROM shifts 
                           WHERE id=? AND postedBy=?
                     UNION SELECT id
                           FROM users 
                           WHERE admin=1 AND id=?`; 

    // run the query
    mc.query(permissionQuery, [shiftId, deletedBy, deletedBy], function (error, results, fields) {
      if (error) throw error;
      return callback(results);
    });

  }
  
  checkPermission(function(result) {
    
    // if the query returned something that means they have permission
    if (result.length > 0) {
      hasPermission = true;
    }

    if (hasPermission) {

      // now we can actually delete the record
      // set up the query
      var query = `DELETE FROM shifts 
                   WHERE id=?`;

      // run the query 
      mc.query(query, [shiftId], function (error, results, fields) {
        if (error) throw error;
        return res.json({ data: results, message: 'Shift has been deleted successfully.' });
      });

    } else {
      return res.status(403).json({ message: 'You do not have permission to do that!' });
    }

  });

});

// Listen
const port = process.env.PORT || 3001;
app.listen(port, function () {
  console.log('Node app is running on port ' + port);
});
 
