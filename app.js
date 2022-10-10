const express = require('express');
const app = express();
const db = require('./db/connection');

db.connect()
.then(() =>
{
    console.log("Database connected...");
})
.catch((err) =>
{
    console.log(err);
})

app.use('/api/topics', require('./routes/topics'));

const PORT = process.env.PORT || 9090;

app.listen(PORT, console.log(`Server started on port ${PORT}...`));

module.exports = app;