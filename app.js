const app = require('express')();
const PORT = 3000;

app.listen(
    PORT, () => console.log(`connected to http://localhost:${PORT}`)
)

app.get('/home',(req,res)=>{
    res.status(200).send('hi')
});

app.post('/home',(req,res)=>{
    
});