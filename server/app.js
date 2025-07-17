const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const expenseRoutes = require('./routes/expenseRoute');
const settlementRoutes = require('./routes/settlementRoute');
const analyticsRoute = require('./routes/analyticsRoute');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Define routes 
app.get('/', (req,res)=>{
    res.send('server is running');
});

app.use('/api/expenses', expenseRoutes);
app.use('/api/settlements', settlementRoutes);
app.use('/api/analytics', analyticsRoute);

module.exports = app;
