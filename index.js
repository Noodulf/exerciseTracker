const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:false}));
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

let users = [];
app.post("/api/users",(req,res)=>{
  let count=0;
  users.push({username:req.body.username,_id:(users.length+1).toString(),log:[],count:count});
  let response=users.find(user=>user.username===req.body.username)
  res.json({username:response.username,_id:response._id});
})

app.get("/api/users",(req,res)=>{
  let response=[];
  for(let i=0;i<users.length;i++){
    response.push({username:users[i].username,_id:users[i]._id});
  }
  console.log("Response test",response);
  res.json(response);
})

app.post("/api/users/:_id/exercises",(req,res)=>{
  let user= users.find(user=>parseInt(user._id)===parseInt(req.params._id));
  console.log(user);
  let date;
  if(req.body.date){
    date= new Date(req.body.date).toDateString();
    user.log.push({description:req.body.description,duration:parseInt(req.body.duration),date:date});
    console.log("Date check:",req.body.date);
    user.count++;
  }
  else{
    date= new Date().toDateString();
    user.log.push({description:req.body.description,duration:parseInt(req.body.duration),date:date});
    user.count++;
  }
  
  console.log(user);
  let response={_id:user._id,username:user.username,date:date,description:req.body.description,duration:parseInt(req.body.duration)};
  console.log("This is the response test",response);
  res.json(response);
}
)

app.get("/api/users/:_id/logs", (req, res) => {
  let user = users.find(user => user._id === req.params._id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  let logs = user.log;

  const { from, to, limit } = req.query;

  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    logs = logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= fromDate && logDate <= toDate;
    });
  }

  if (limit) {
    const limitNumber = parseInt(limit, 10);
    logs = logs.slice(0, limitNumber);
  }

  let response = {
    username: user.username,
    count: logs.length,
    _id: user._id,
    log: logs
  };

  console.log("This is the log test", response);
  res.json(response);
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
