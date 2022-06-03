//Database code that we are testing
let db = require("../database");

//Server code that we are testing
let server = require("../server");

//Set up Chai library
let chai = require("chai");
let should = chai.should();
let assert = chai.assert;
let expect = chai.expect;

//Set up Chai for testing web service
let chaiHttp = require("chai-http");
chai.use(chaiHttp);

//Import the mysql module and create a connection pool with the user details
const mysql = require("mysql");
const connectionPool = mysql.createPool({
  connectionLimit: 1,
  host: "localhost",
  user: "dg",
  password: "123456",
  database: "restview",
  debug: false,
});

//Wrapper for all database tests
describe("Database", () => {
  //Mocha test for getAllRestaurants method in database module.
  describe("#getAllRestaurants", () => {
    it("should return all of the restaurants in the database", (done) => {
      //Mock response object for test
      let response = {};

      /* When there is an error response.staus(ERROR_CODE).json(ERROR_MESSAGE) is called
               Mock object should fail test in this situation. */
      response.status = (errorCode) => {
        return {
          json: (errorMessage) => {
            console.log(
              "Error code: " + errorCode + "; Error message: " + errorMessage
            );
            assert.fail(
              "Error code: " + errorCode + "; Error message: " + errorMessage
            );
            done();
          },
        };
      };

      //Add send function to mock object
      response.send = (result) => {
        //Convert result to JavaScript object
        let resObj = JSON.parse(result);

        //Check that an array of restaurants is returned
        resObj.should.be.a("array");

        //Check that appropriate properties are returned
        if (resObj.length > 1) {
          resObj[0].should.have.property("post_id");
          resObj[0].should.have.property("post_date");
          resObj[0].should.have.property("user_email");
          resObj[0].should.have.property("rest_name");
          resObj[0].should.have.property("rest_rating");
          resObj[0].should.have.property("rest_img");
          resObj[0].should.have.property("rest_review");
        }

        //End of test
        done();
      };

      //Call function that we are testing
      db.getAllRestaurants(response);
    });
  });

  //Mocha test for register method in database module.
  describe("#register", () => {
    it("should add a user to the database", (done) => {
      //Mock response object for test
      let response = {};

      /* When there is an error response.staus(ERROR_CODE).json(ERROR_MESSAGE) is called
               Mock object should fail test in this situation. */
      response.status = (errorCode) => {
        return {
          json: (errorMessage) => {
            console.log(
              "Error code: " + errorCode + "; Error message: " + errorMessage
            );
            assert.fail(
              "Error code: " + errorCode + "; Error message: " + errorMessage
            );
            done();
          },
        };
      };

      //Add send function to mock object. This checks whether function is behaving correctly
      response.send = () => {
        //Check that user has been added to database
        let sql = "SELECT name FROM users WHERE name='" + name + "'";
        connectionPool.query(sql, (err, result) => {
          if (err) {
            //Check for errors
            assert.fail(err); //Fail test if this does not work.
            done(); //End test
          } else {
            //Check that user has been added
            expect(result.length).to.equal(1);

            //Clean up database
            sql = "DELETE FROM users WHERE name='" + name + "'";
            connectionPool.query(sql, (err, result) => {
              if (err) {
                //Check for errors
                assert.fail(err); //Fail test if this does not work.
                done(); //End test
              } else {
                done(); //End test
              }
            });
          }
        });
      };

      //Create random user details
      let name = Math.random().toString(36).substring(2, 15);
      let email = name + "@mail.com";
      let phone = "1234567890";
      let password = "123";

      //Call function to add user to database
      db.register(false, name, email, phone, password, response);
    });
  });
});

//Wrapper for all web service tests
describe("Web Service", () => {
  //Test of GET request sent to /restaurants
  describe("/GET restaurants", () => {
    it("should GET all the restaurants", (done) => {
      chai
        .request(server)
        .get("/restaurants")
        .end((err, response) => {
          //Check the status code
          response.should.have.status(200);

          //Convert returned JSON to JavaScript object
          let resObj = JSON.parse(response.text);

          //Check that an array of customers is returned
          resObj.should.be.a("array");

          //Check that appropriate properties are returned
          if (resObj.length > 1) {
            resObj[0].should.have.property("post_id");
            resObj[0].should.have.property("post_date");
            resObj[0].should.have.property("user_email");
            resObj[0].should.have.property("rest_name");
            resObj[0].should.have.property("rest_rating");
            resObj[0].should.have.property("rest_img");
            resObj[0].should.have.property("rest_review");
          }

          //End test
          done();
        });
    });
  });

  //Test of GET request sent to /checklogin
  describe("/GET checklogin", () => {
    it("should GET if a user is logged in or not", (done) => {
      chai
        .request(server)
        .get("/checklogin")
        .end((err, response) => {
          //Check the status code
          response.should.have.status(200);

          //Convert returned JSON to JavaScript object
          let resObj = JSON.parse(response.text);

          //Check that an array of customers is returned
          resObj.should.be.a("object");

          //End test
          done();
        });
    });
  });
});
