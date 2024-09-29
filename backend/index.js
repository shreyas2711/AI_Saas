const express = require('express');
const { Client } = require('pg');
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser'); 
const cookieParser = require('cookie-parser');
const cors = require('cors');
const folderRoutes = require('./routes/folderRoutes');
const tranformedRoutes = require('./routes/tranformedRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const app = express();


app.use(cookieParser());


app.use(cors({
  origin: 'http://localhost:3000',  
  credentials: true               
}));
app.use(express.json());
const port = 4000;



// const db = new Client({user:process.env.PG_USER, host:process.env.PG_HOST, database:process.env.PG_DATABASE, password:process.env.PG_PASSWORD,port:process.env.PG_PORT});
const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,  
  },
});

db.connect() .then(() => { console.log('Connected to PostgreSQL database!'); }) 
.catch((err) => { console.error('Error connecting to the database:', err); });



app.use('/api',authRoutes(db));
app.use('/api',folderRoutes(db));
app.use('/api',tranformedRoutes(db));
app.use('/api',paymentRoutes(db));


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

