const express = require('express');
var cors = require('cors');
//const {router} = require('./routes/employee-routes');
var swaggerUi = require("swagger-ui-express");
const swaggerDocument = require('./swagger.json');

var app = express();

//Configure the middleware and routes

// app.use(function(req,resp,next){
//     console.log("Middleware 1 - Request");
//     next();
//     console.log("Middleware 1 - Response");
// });

// app.use(function(req,resp,next){
//     console.log("Middleware 2 - Request");
//     next();
//     console.log("Middleware 2 - Response");
// });

// app.use(function(req,resp,next){
//     console.log("Middleware 3 - Request");
//     next();
//     console.log("Middleware 3 - Response");
// });

app.use(express.json());
app.use(express.urlencoded({extened:true}));
app.use(cors());

//Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

// let emps =[
//     {LocationID: 'MUM', EmpCode: 'E1', Name:"Ajay", Age:40, Department:"IT", Designation:"Manager"}
// ];

// //list all employees
// app.get("/employees",(req,res)=>{
// res.status(200).json(emps);
// });

// //add an employee
// app.post("/employees",(req,res)=>{
//     console.log(req.body);
//     let employee=req.body;
//     emps.push(employee);
//     return res.status(201).json(employee);
//     });

// app.get("/about",(req,res)=>{
//     res.send(`<html>
//     <head><title>Sample App</title></head>
//     <body>
//         <h2>About Employee API</h2>
//     </body>
//     </html>`)
// });

// app.get("/contact",(req,res)=>{
//     res.send(`<html>
//     <head><title>Sample App</title></head>
//     <body>
//         <h2>Contact Page</h2>
//     </body>
//     </html>`)
// });

//configure routes
app.use("/employees",require('./routes/employee-routes').router);

app.use((req, res, next) => {
    return res.status(404).json({
      error: "Not Found",
    });
  });
  

//configure error handlers
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV == "development") {
    console.error(err.stack);
    }
    res.status(500).send({ 'error': 'Something broke!' })
    });

    module.exports=app;