const express = require("express")
const request = require('request')

const bodyParser = require("body-parser")
const https = require('https')
require('dotenv').config()

console.log(process.env)

const app = express();
const port = process.env.PORT||3000 

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))


app.listen(port,function(req,res){
    console.log("Server is running on port:"+port);
})

app.get('/',function (req,res) {
    res.sendFile(__dirname+'/signup.html')
})

app.post('/',function(req,res){
   const firstName = req.body.firstName;
   const lastName = req.body.lastName;
   const email = req.body.email;
   const data = {
    members:[
        {
         email_address:email,
         status:"subscribed",
         merge_fields:{
            FNAME:firstName,
            LNAME:lastName
         }   
        }
    ]
   };
 
   const jsonData = JSON.stringify(data);
   const url = 'https://us12.api.mailchimp.com/3.0/lists/8f035f1c5a';
  
   const options = {
    method:"POST",
    auth :"akash50:"+process.env.API_KEY
   }

   const apiRequest = https.request(url,options,function(response){

    if(response.statusCode===200){
        res.sendFile(__dirname+"/success.html")
    }else{
        res.sendFile(__dirname+"/failure.html")
    }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
   })

   apiRequest.write(jsonData);
   apiRequest.end();
})

app.post('/failure',function(req,res){
    res.redirect("/")
})









