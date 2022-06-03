// TO TEST THE FUNCTION, PLEASE 'export' THE FUNCTION IN 'client.js'
// CANNOT KEEP THE FUNCTION EXPORTED AS IT CAUSES ISSUES FOR SOME REASON

//File containing the functions that we are testing
import { isEmailValid } from "../client.js";

//Import expect from chai
let expect = chai.expect;

// Client side Mocha test for isEmailValid function
describe("#isEmailValid", () => {
  it("should return true", (done) => {
    //Run some tests that sensibly explore the behaviour of the function
    let result = isEmailValid("test@mail.com");
    expect(result).to.equal(true);

    //Call function to signal that test is complete
    done();
  });
});
