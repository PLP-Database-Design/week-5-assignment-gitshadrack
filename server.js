// Import dependencies
const express = require('express')
const mysql = require('mysql2')
const dotenv = require('dotenv')

// Initialize Express application
const app = express()

// Configure environment variables

dotenv.config()

// Create a MySQL connection object using environment variables
 const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

 })

// Test the database connection
 db.connect((err)=>{
    if(err){
       // Log an error message if the connection fails
      return console.log('Failed to Connection to Mysql: ',err.message)
    } 
    // Log a success message if the connection is successful
    console.log('Succeffully Connected to Mysql: ', db.threadId)
 })

// Define a basic route

app.get('/', (req, res)=>{
   res.render('index');
 })

 app.set('view engine','ejs')
 app.set('views',__dirname + '/views')

//Retireve all patients endpoint

app.get('/patients', (req, res) => {
  const getPatients = "SELECT patient_id, first_name, last_name FROM patients";
  db.query(getPatients, (err, data) => {
      if (err) {
          return res.status(400).send('Failed to Get patients data: ' + err.message);
      }
      //Rnder the 'data'  template and pass data
      res.status(200).render('patients', { data})
  });
});

//Retrive all Proividers
app.get('/providers', (req, res)=>{
  const getProviders = "SELECT first_name, last_name, provider_specialty FROM providers"
  db.query(getProviders, (err, data)=>{
    // if to get err
    if(err){
      return res.status(400).send("Failed to fetch Providers", err.message)
    }
    res.status(200).render('providers', {data})
  })
})

//Filter patients by First Name
app.get('/firstname', (req, res)=>{
  const patientsFirstname ="SELECT first_name FROM patients"
  db.query(patientsFirstname, (err, data)=>{
// Check fails
    if(err){
      return res.status(400).send('Failed to fetch first_name', err.message)
    }
    res.status(200).render('firstname', {data})
  })
})

//Retrieve all providers by their specialty
app.get('/speciality', (req, res)=>{
  const speciality = "SELECT * FROM providers ORDER BY provider_specialty"
  db.query(speciality, (err, data)=>{

    if(err){
      return res.status(400).send('Failed to fetch speciality', err.message)
    }
    res.status(200).render('speciality', {data})
  })
})


// Start the server and listen on the specified port
const PORT = 8000
app.listen(PORT, ()=>{
  console.log(`Server is Running on http://localhost:${PORT}`)
})


