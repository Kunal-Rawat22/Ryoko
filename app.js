require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const md5 = require('md5');

// const encrypt = require('mongoose-encryption');
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const RegRsponse = [
    {
        Title:'Uh oh!',
        Message:'There was a problem in signing you up. Please try again or contact the developer',
        BtnMsg:'Try Again'
    },
    {
        Title: 'Awesome !!',
        Message: "You've been Successfully signed up to our Newsletter, look forward to lots of awesome content",
        BtnMsg: 'Login !!'
    }
]
const logResponse = [{
    Title:'Uh oh!',
    Message:'There was a problem in login you up. Please try again or contact the developer',
    BtnMsg:'Login Again'
}]

//MonogoDb Connection
async function main () {
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true
     }
     
     try {
      await mongoose.connect("mongodb://127.0.0.1:27017/teamTrojanDB", connectionOptions);
      console.log(`Connected to MongoDB`)
     } catch (err) {
      console.log(`Couldn't connect: ${err}`)
     }
}
 
main();

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique : true
    },
    password: {
      type: String,
      required: true,
    }
  })
  
  const User = mongoose.model('Users', userSchema);
  
  async function findO(RequestedObj)
  {
      const result = await User.findOne(
          {
              email: RequestedObj.email,
          });
      // console.log(result);
      if (result !== null)
          return result;
      else 
          return null
  }
  
//Express Js
app.route('/')
    .get(function (req, res) {
        res.sendFile(__dirname + '/home.html');
    });

app.route('/login')
    .get( function (req, res) {
        res.render('login',{Title:'Login ', Body:'Log In',flag:1});
    })
    .post(function (req, res) {

        const RequestedObj = {
            email: req.body.username,
            password: req.body.password
        }
        findO(RequestedObj).then((result) => {
            // console.log(result);
            if (result !== null && result.password==md5(RequestedObj.password))
                res.render();
            else
                res.sendFile(__dirname+'/404page.html');
        }).catch((err)=>{
            console.log(err);
            res.sendFile(__dirname+'/404page.html');
        }) 
})
app.route('/register')
    .get(function (req, res) {
       res.render('login',{Title:'Register ', Body:'Sign Up',flag:0});
    })
    .post(function (req, res) {
        const newUser = new User({
            email: req.body.username,
            password: md5(req.body.password)
        })
        newUser.save().then((newUser) => {
            res.render('Response1', { Obj: RegRsponse[1] })
        }).catch((err)=>{
            console.log(err);
            res.render('Response1', { Obj: RegRsponse[0] });
        });

    });
app.get('/india', function (req, res) {
    res.sendFile(__dirname+ '/parallex.html');
  })
app.get('/places', function (req, res)
{
    res.sendFile(__dirname + '/Places.html');
})
app.get('/404', function (req, res) {
    res.sendFile(__dirname + '/404page.html');
})

app.listen(3000, function () { console.log("Server started on 3000") });
