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

// Add a user to the database or update their information if their entry already exists
app.post('/api/user', function (req, res, next) {
  var id = req.body.id;
  var name = req.body.name;
  var email = req.body.email;

  if (!id || !name) {
    return res.status(400).json({ message: 'Missing information.' });
  }

  mc.query('INSERT INTO users (id, name, email) VALUES (?,?,?) ON DUPLICATE KEY UPDATE name=VALUES(name)', [id, name, email], function (error, results, fields) {
    if (error) throw error;
    return res.json({ data: results, message: 'User information stored successfully.' });
  });
});
 
// Retrieve all shifts
// Date is formatted like "Wednesday March 20 2019"
app.get('/api/shifts', function (req, res) {
  mc.query('SELECT s.id, s.createdAt, DATE_FORMAT(s.shiftDate, "%W %M %e %Y") AS shiftDate, s.shiftTime, up.name AS postedBy, uc.name AS coveredBy, s.helpSession, s.majorPreference, s.yearPreference, s.comments FROM shifts s LEFT JOIN users up ON up.id=s.postedBy LEFT JOIN users uc ON uc.id=s.coveredBy', function (error, results, fields) {
    if (error) { throw error; }
    return res.json({ data: results });
  });
});

// Retrieve shifts posted by user
app.get('/api/postedShifts/:id', function (req, res) {
  var id = req.params.id;

  mc.query('SELECT s.id, s.createdAt, DATE_FORMAT(s.shiftDate, "%W %M %e %Y") AS shiftDate, s.shiftTime, up.name AS postedBy, uc.name AS coveredBy, s.helpSession, s.majorPreference, s.yearPreference, s.comments FROM shifts s LEFT JOIN users up ON up.id=s.postedBy LEFT JOIN users uc ON uc.id=s.coveredBy WHERE up.id=?', [id], function (error, results, fields) {
    if (error) { throw error; }
    return res.json({ data: results });
  });
});

// Retrieve shifts covered by user
app.get('/api/coveredShifts/:id', function (req, res) {
  var id = req.params.id;

  mc.query('SELECT s.id, s.createdAt, DATE_FORMAT(s.shiftDate, "%W %M %e %Y") AS shiftDate, s.shiftTime, up.name AS postedBy, uc.name AS coveredBy, s.helpSession, s.majorPreference, s.yearPreference, s.comments FROM shifts s LEFT JOIN users up ON up.id=s.postedBy LEFT JOIN users uc ON uc.id=s.coveredBy WHERE uc.id=?', [id], function (error, results, fields) {
    if (error) { throw error; }
    return res.json({ data: results });
  });
});

// Retrieve shift by id
// Date is formatted like "Wednesday March 20 2019"
app.get('/api/shift/:id', function (req, res) {
  var shiftId = req.params.id;

  mc.query('SELECT s.id, s.createdAt, DATE_FORMAT(s.shiftDate, "%W %M %e %Y") AS shiftDate, s.shiftTime, up.name AS postedBy, uc.name AS coveredBy, s.helpSession, s.majorPreference, s.yearPreference, s.comments FROM shifts s LEFT JOIN users up ON up.id=s.postedBy LEFT JOIN users uc ON uc.id=s.coveredBy WHERE s.id=?', [shiftId], function (error, results, fields) {
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

  if (!shiftDate || !shiftTime || !postedBy || !helpSession || !majorPreference || !yearPreference) {
    return res.status(400).json({ message: 'Missing information.' });
  }

  mc.query('INSERT INTO shifts (shiftDate, shiftTime, postedBy, helpSession, majorPreference, yearPreference, comments) VALUES (?,?,?,?,?,?,?)', [shiftDate, shiftTime, postedBy, helpSession, majorPreference, yearPreference, comments], function (error, results, fields) {
    if (error) throw error;
    return res.json({ data: results, message: 'New shift has been created successfully.' });
  });
});

// Cover a shift
// Updates the shift's "covered by" field
app.put('/api/shift', function (req, res) {
  var shiftId = req.body.id;
  var coveredBy = req.body.coveredBy;
  
  if (!shiftId || !coveredBy) { 
    return res.status(400).json({ message: 'Missing information.' });
  }
  
  mc.query('UPDATE shifts SET coveredBy=? WHERE id=?', [coveredBy, shiftId], function (error, results, fields) {
    if (error) throw error;
    return res.json({ data: results, message: 'Shift has been updated successfully.' });
  });
}); 

// Listen
const port = process.env.PORT || 3001;
app.listen(port, function () {
  console.log('Node app is running on port ' + port);
});
 
