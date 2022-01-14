const { Router } = require('express');
const { EmployeeService } = require('../helpers/employee-helper');

var router = Router();
var empSvc = new EmployeeService();

//Get all employees
//GET /employees

// router.get("/",(req,res)=>{
//    res.status(200).json([]);
// });

router.get("/", async (req, res) => {
    let emps = await empSvc.getAllEmployees()
        .catch(err => res.status(500).json({ 'message': 'Unable to read the employees' }));
    if (emps) {
        res.status(200).json(emps);
    }
});


//Add an employee
//POST /employees

router.post("/", async (req, res) => {
    let employee = req.body;
    console.log(employee);
    let result = await empSvc.addEmployee(employee).catch(err => res.status(500).json({ 'message': 'Unable to add new employee' + err }));
    if (result) {
        res.status(201).json({ 'message': 'Employee added successfully' })
    }
});

//Get employees from a location
//GET /employees/location/:locId
router.get('/location/:locId', async (req, res) => {
    let locationId = req.params["locId"];
    let result = await empSvc.getEmployeesByLocation(locationId)
        .catch(err => {
            console.log(err);
            res.status(500).json({ 'message': 'Error in fetching employees data' + err })
        })
    if (result) {
        res.status(200).json(result.Items);
    }
})

//Get a single employee
//GET /employees/location/:locId/empcode/:ecode
router.get("/location/:locId/empcode/:ecode", async (req, res) => {
    let locationId = req.params["locId"];
    let empCode = req.params["ecode"];
    let result = await empSvc.getEmployee(locationId, empCode)
        .catch(err => {
            console.log(err);
            res.status(500).json({ 'message': 'Unable to get employee details' })
        })
    if (result) {
        res.status(200).json(result);
    } else {
        res.status(404).json({ 'message': 'Employee not found' });
    }
});

module.exports = { router }