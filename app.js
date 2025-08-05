const app = require('express')();
const PORT = 3000;

app.listen(
    PORT, () => console.log(`connected to http://localhost:${PORT}`)
)