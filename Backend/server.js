const express = require('express') 
const cors = require('cors')
const mongoose = require('mongoose')
 const configs = require('./configs')
 const AdminRouter = require('./routers/admin.route')
 const AuthRoute = require('./routers/auth.route')
const app = express();
const PublicRouter= require('./routers/client.route')
const path = require('path');
const AppointmentRouter= require('./routers/Appointment.route')

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
 app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://mern-hospital-mangement.vercel.app' 
  ], 
  credentials: true,
  exposedHeaders: ['request-id']  
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
 

app.use('/api/public',PublicRouter);
app.use('/api/auth',AuthRoute);
app.use('/api/admin',AdminRouter);
app.use('/api/appointment',AppointmentRouter)


const PORT = 3200

mongoose.connect(configs.MONGO_URL)
.then(() => {
     console.log('mongodb is connected')
  }).catch(err => console.error('Database connection breakdown: ', err));

app.listen(PORT, ()=>{
console.log('server is running on',PORT)
})

