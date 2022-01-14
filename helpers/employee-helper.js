const { ddbClient } = require('./ddbclient');
const { ScanCommand, PutItemCommand, QueryCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const {marshall,unmarshall} = require('@aws-sdk/util-dynamodb')

class EmployeeService {

    constructor() {
        this.TABLENAME = process.env.TABLENAME || "Employees"
    }

   async getAllEmployees() {
        let params = {
            TableName: this.TABLENAME,
           // Select: 'ALL_ATTRIBUTES', //https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/scancommandinput.html#select
            // FilterExpression: 'Department = :dept',
            // ExpressionAttributeValues: {
            // ':dept' : {S: 'IT'}
            // },
            // ProjectionExpression: '#Ename, Age, Designation, Department, #Loc',
            // ExpressionAttributeNames: {
            // "#Ename":"Name",
            // "#Loc":"Location"
            // }
        }
        //return ddbClient.send(new ScanCommand(params));
        let result = await ddbClient.send(new ScanCommand(params))
            .catch(err => {
                console.log("Cust err:" + err);
                return Promise.reject(err);
            });
        let employees = [];
        result.Items.forEach((item) => employees.push(unmarshall(item)));
        return Promise.resolve(employees)
    }

    addEmployee(employee) {
        console.log(employee);

        let params = {
            TableName: this.TABLENAME,
            Item : marshall(employee)
            // Item: {
            //     LocationID: { S: employee.LocationID }, //PK
            //     EmpCode: { S: employee.EmpCode }, //SK
            //     Designation: { S: employee.Designation },
            //     Department: { S: employee.Department },
            //     Age: { N: employee.Age },
            //     Name: { S: employee.Name },
            //     Location: { S: employee.Location }
            // }
        };
        console.log(params);
        return ddbClient.send(new PutItemCommand(params));
    }


    // addEmployee(Employee) {

    //     console.log(Employee);

    //     let params = {

    //         TableName: this.TABLENAME,

    //         Item: {

    //             LocationID: { S: Employee.LocationID },

    //             EmpCode: { S: Employee.EmpCode },

    //             Name: { S: Employee.Name },

    //             Age: { N: Employee.Age },

    //             Designation: { S: Employee.Designation },

    //             Department: { S: Employee.Department },

    //             Location: { S: Employee.Location },

    //         },

    //     };

    //     console.log(params);

    //     return ddbClient.send(new PutItemCommand(params));

    // }

    getEmployeesByLocation(locationId) {
        var params = {
            TableName: this.TABLENAME,
            KeyConditionExpression: "LocationID = :locId",
            ExpressionAttributeValues: {
                ":locId": { 'S': locationId }
            }
        };
        return ddbClient.send(new QueryCommand(params));
    }

   async getEmployee(locationId, empCode) {
        var params = {
            TableName: this.TABLENAME,
            Key: {
                "LocationID": { "S": locationId },
                "EmpCode": { "S": empCode }
            }
        };
        //return ddbClient.send(new GetItemCommand(params));
        let result = await ddbClient.send(new GetItemCommand(params)).catch(err => Promise.reject(err));

    return Promise.resolve(result.Item ? unmarshall(result.Item) : undefined)
    }
}

module.exports = { EmployeeService }