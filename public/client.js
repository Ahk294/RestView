let userValidated = false;

// varibale to manipulate divs
let title;

let navBar;

let registerToast;
let regMsg;
let regHeading;

let loginToast;
let loginMsg;
let loginHeading;

let addRestToast;
let addRestMsg;
let addRestHeading;

let restToast;
let restMsg;
let restHeading;

let homeDiv;
let loginDiv;
let registerDiv;
let myProfileDiv;
let restaurantDiv;
let addRestaurantDiv;
let updateRestaurantDiv;

let restPostDiv;

let restInfoDiv;
let commentsDiv;

let myProfileToast;
let myProfileMsg;
let myProfileHeading;

let myProfileInfoDiv;

let postHistoryDiv;

let updateRestToast;
let updateRestMsg;
let updateRestHeading;

let updateRestaurantInfoDiv;

//Set up page when window has loaded
window.onload = init;

//Get pointers to parts of the DOM after the page has loaded.
function init() {
  title = document.getElementById("title");

  navBar = document.getElementById("nav-bar");

  registerToast = document.getElementById("registerToast");
  regMsg = document.getElementById("reg-msg");
  regHeading = document.getElementById("reg-heading");

  loginToast = document.getElementById("loginToast");
  loginMsg = document.getElementById("login-msg");
  loginHeading = document.getElementById("login-heading");

  addRestToast = document.getElementById("addRestToast");
  addRestMsg = document.getElementById("add-rest-msg");
  addRestHeading = document.getElementById("add-rest-heading");

  restToast = document.getElementById("restToast");
  restMsg = document.getElementById("rest-msg");
  restHeading = document.getElementById("rest-heading");

  homeDiv = document.getElementById("home");
  loginDiv = document.getElementById("login");
  registerDiv = document.getElementById("register");
  myProfileDiv = document.getElementById("myProfile");
  restaurantDiv = document.getElementById("restaurant");
  addRestaurantDiv = document.getElementById("addRestaurant");
  updateRestaurantDiv = document.getElementById("updateRestaurant");

  restPostDiv = document.getElementById("post");

  restInfoDiv = document.getElementById("restInfo");
  commentsDiv = document.getElementById("comments");

  myProfileToast = document.getElementById("updateUserToast");
  myProfileMsg = document.getElementById("update-Msg");
  myProfileHeading = document.getElementById("update-Heading");

  myProfileInfoDiv = document.getElementById("myProfileInfo");

  postHistoryDiv = document.getElementById("postHistory");

  updateRestToast = document.getElementById("updateRestToast");
  updateRestMsg = document.getElementById("update-rest-msg");
  updateRestHeading = document.getElementById("update-rest-heading");

  updateRestaurantInfoDiv = document.getElementById("updateRestaurantInfo");

  // setting the 'show' property of a toast to successfully show/hide it
  $(".toast").toast("show");

  // checking if user is logged in to set the navbar
  checklogin();

  // displaying all the reviews on home page
  displayRestaurants();
}

// load functions to load the different divs and perform respective functions
function loadHome() {
  title.innerHTML = "Home";
  homeDiv.style.display = "block";
  loginDiv.style.display = "none";
  registerDiv.style.display = "none";
  myProfileDiv.style.display = "none";
  restaurantDiv.style.display = "none";
  addRestaurantDiv.style.display = "none";
  updateRestaurantDiv.style.display = "none";

  displayRestaurants();
}

function loadLogin() {
  title.innerHTML = "Login";
  loginToast.style.display = "none";
  document.getElementById("login-email").value = "";
  document.getElementById("login-password").value = "";

  homeDiv.style.display = "none";
  loginDiv.style.display = "block";
  registerDiv.style.display = "none";
  myProfileDiv.style.display = "none";
  restaurantDiv.style.display = "none";
  addRestaurantDiv.style.display = "none";
  updateRestaurantDiv.style.display = "none";
}

function loadRegister() {
  title.innerHTML = "Register";
  registerToast.style.display = "none";
  document.getElementById("reg-name").value = "";
  document.getElementById("reg-email").value = "";
  document.getElementById("reg-phone").value = "";
  document.getElementById("reg-password").value = "";
  document.getElementById("cPass").value = "";

  homeDiv.style.display = "none";
  loginDiv.style.display = "none";
  registerDiv.style.display = "block";
  myProfileDiv.style.display = "none";
  restaurantDiv.style.display = "none";
  addRestaurantDiv.style.display = "none";
  updateRestaurantDiv.style.display = "none";
}

function loadMyProfile() {
  getUserInfo();
  getUserPostHistory();
  title.innerHTML = "My Profile";
  homeDiv.style.display = "none";
  loginDiv.style.display = "none";
  registerDiv.style.display = "none";
  myProfileDiv.style.display = "block";
  restaurantDiv.style.display = "none";
  addRestaurantDiv.style.display = "none";
  updateRestaurantDiv.style.display = "none";
}

function loadRestaurant(post_id) {
  title.innerHTML = "Restaurant";
  restToast.style.display = "none";
  homeDiv.style.display = "none";
  loginDiv.style.display = "none";
  registerDiv.style.display = "none";
  myProfileDiv.style.display = "none";
  restaurantDiv.style.display = "block";
  addRestaurantDiv.style.display = "none";
  updateRestaurantDiv.style.display = "none";

  getRestaurant(post_id);
  getComments(post_id);
}

function loadAddRestaurant() {
  title.innerHTML = "Add Review";
  addRestToast.style.display = "none";
  document.getElementById("rest-name").value = "";
  document.getElementById("dropdown").value = "";
  document.getElementById("image").value = "";
  document.getElementById("review").value = "";
  document.getElementById("location").value = "";

  homeDiv.style.display = "none";
  loginDiv.style.display = "none";
  registerDiv.style.display = "none";
  myProfileDiv.style.display = "none";
  restaurantDiv.style.display = "none";
  addRestaurantDiv.style.display = "block";
  updateRestaurantDiv.style.display = "none";
}

function loadUpdateRestaurant(post_id) {
  title.innerHTML = "Update Review";
  homeDiv.style.display = "none";
  loginDiv.style.display = "none";
  registerDiv.style.display = "none";
  myProfileDiv.style.display = "none";
  restaurantDiv.style.display = "none";
  addRestaurantDiv.style.display = "none";
  updateRestaurantDiv.style.display = "block";

  getRestaurantInfo(post_id);
}

/* Displays all the restaurants from the db. */
function displayRestaurants() {
  //Set up XMLHttpRequest
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = () => {
    //Called when data returns from server
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      //Convert JSON to a JavaScript object
      let restArr = JSON.parse(xhttp.responseText);

      //Return if no restaurant
      if (restArr.length === 0) {
        return;
      }

      let htmlStr = "";

      for (let key in restArr) {
        htmlStr += '<div class="col-md-3 my-2 ml-1 mr-1 card">';
        htmlStr += '<div class="card-body mb-3">';
        htmlStr +=
          '<img src="./uploads/' +
          restArr[key].rest_img +
          '" class="card-img-top img-fluid" alt="' +
          restArr[key].rest_img +
          '" />';
        htmlStr +=
          '<h4 class="card-title mt-2">' + restArr[key].rest_name + "</h4>";
        for (let i = 1; i <= restArr[key].rest_rating; i++) {
          htmlStr += '<h4 class="fas fa-star" ></h4>';
        }
        htmlStr +=
          '<p class="card-text mt-2">' + restArr[key].rest_review + "</p>";
        htmlStr +=
          '<p class="card-text"><i class="fas fa-user-circle"></i> ' +
          restArr[key].user_email +
          "</p>";
        htmlStr +=
          '<p class="card-text mt-2"><i class="fas fa-map-marker-alt"></i> ' +
          restArr[key].rest_location +
          "</p>";
        htmlStr +=
          '<button class="mt-3 btn btn-primary rounded" onclick="loadRestaurant(' +
          restArr[key].post_id +
          ')">View</button>';
        htmlStr += "</div>";
        htmlStr += "</div>";
      }
      restPostDiv.innerHTML = htmlStr;
    }
  };

  //Request data for all restaurants
  xhttp.open("GET", "/restaurants", true);
  xhttp.send();
}

// adding comment to the respective post using the post_id
function addComment(post_id) {
  //Extract comment data
  let comment = document.getElementById("comment").value;

  if (comment === "") {
    restShowToast(restToast, "Please write a comment.", "ERROR!");
  } else {
    //Put comment and post_id inside FormData object
    const formData = new FormData();
    formData.append("comment", comment);
    formData.append("post_id", post_id);

    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    xhttp.onload = () => {
      if (xhttp.responseText === '{"result": "Comment added successfully"}') {
        loadRestaurant(post_id);
      } else if (
        xhttp.responseText === '{"result": "Please login to add a comment."}'
      ) {
        restShowToast(restToast, "Please login to add a comment.", "ERROR!");
      } else {
        restShowToast(
          restToast,
          "Something went wrong, please try again.",
          "ERROR!"
        );
        loadHome();
      }
    };

    //Send off formDara to add the comment
    xhttp.open("POST", "/addcomment");
    xhttp.send(formData);
  }
}

// getting a single post to be viewed individually using post_id
function getRestaurant(post_id) {
  //Set up XMLHttpRequest
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = () => {
    //Called when data returns from server
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      //Convert JSON to a JavaScript object
      let restArr = JSON.parse(xhttp.responseText);

      //Return if no restaurant found
      if (restArr.length === 0) {
        return;
      }

      let htmlStr = "";

      for (let key in restArr) {
        htmlStr +=
          '<img src="./uploads/' +
          restArr[key].rest_img +
          '" class="float-start img-fluid" style="height: 400px; width: fit-content"/>';
        htmlStr += "<h1><b>" + restArr[key].rest_name + "</b></h1>";
        htmlStr +=
          '<p style="text-align: justify">' +
          restArr[key].rest_location +
          "</p>";
        htmlStr += '<span class="d-flex justify-content-center">';
        for (let i = 1; i <= restArr[key].rest_rating; i++) {
          htmlStr += '<h3 class="fas fa-star" ></h3>';
        }
        htmlStr += "</span>";
        htmlStr +=
          "<p style='text-align: right'> ~" + restArr[key].user_email + "</p>";
        htmlStr +=
          '<p style="text-align: justify">' + restArr[key].rest_review + "</p>";
        htmlStr += "<hr />";
      }
      restInfoDiv.innerHTML = htmlStr;
    }
  };

  //Request data for the specific post using the post_id
  xhttp.open("GET", "/restaurants/" + post_id, true);
  xhttp.send();
}

// getting the comments of a single post using the post_id
function getComments(post_id) {
  //Set up XMLHttpRequest
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = () => {
    //Called when data returns from server
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      //Convert JSON to a JavaScript object
      let commentsArr = JSON.parse(xhttp.responseText);
      let htmlStr = "";

      //Return if no comment on post
      if (commentsArr.length === 0) {
        htmlStr += "<h2>Leave A Comment</h2>";
        htmlStr +=
          '<textarea name="comment" class="form-control resize-none textarea-height" placeholder="Comment" id="comment" required></textarea>';
        htmlStr +=
          '<button onclick="addComment(' +
          post_id +
          ')" class="btn btn-primary rounded w-50 px-3 py-2 mt-3">Add Comment</button>';
        htmlStr += '<h3 class="mt-5">Comments</h3>';
        htmlStr +=
          "<h1 class='display-3 mt-5' style='text-align: center;'>No Comments</h1>";

        commentsDiv.innerHTML = htmlStr;
        return;
      }

      htmlStr += "<h2>Leave A Comment</h2>";
      htmlStr +=
        '<textarea name="comment" class="form-control resize-none textarea-height" placeholder="Comment" id="comment" required></textarea>';
      htmlStr +=
        '<button onclick="addComment(' +
        post_id +
        ')" class="btn btn-primary rounded w-50 px-3 py-2 mt-3">Add Comment</button>';
      htmlStr += '<h3 class="mt-5">Comments</h3>';

      for (let key in commentsArr) {
        htmlStr += "<div>";
        htmlStr += '<div class="card comment mt-3">';
        htmlStr += '<div class="card-header">';
        htmlStr += '<div class="row d-flex justify-content-between">';
        htmlStr +=
          '<span class="col ml-2" style="text-align: left;">' +
          commentsArr[key].user_email +
          "</span>";
        htmlStr +=
          '<span class="col ml-2" style="text-align: right;">' +
          commentsArr[key].comment_date +
          "</span>";
        htmlStr += "</div>";
        htmlStr += "</div>";
        htmlStr += '<div class="card-body">';
        htmlStr += '<blockquote class="blockquote mb-0">';
        htmlStr += '<p class="mb-0">' + commentsArr[key].comment + "</p>";
        htmlStr += "</blockquote>";
        htmlStr += "</div>";
        htmlStr += "</div>";
        htmlStr += "</div>";
      }
      commentsDiv.innerHTML = htmlStr;
    }
  };

  //Request data for the comments on a specific post using post_id
  xhttp.open("GET", "/comments/" + post_id, true);
  xhttp.send();
}

// GET /logout. Logs the user out.
function logOut() {
  let xhttp = new XMLHttpRequest();

  //Set up function that is called when reply received from server
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      if (this.response === '{"login": false}') {
        checklogin();
        homeDiv.style.display = "block";
        loginDiv.style.display = "none";
        registerDiv.style.display = "none";
        myProfileDiv.style.display = "none";
        restaurantDiv.style.display = "none";
        addRestaurantDiv.style.display = "none";
      } else {
        console.log("Error in server response");
      }
    } else {
      console.log("Error in xhttp");
    }
  };
  //Send request to logout the user
  xhttp.open("GET", "/logout", true);
  xhttp.send();
}

// GET /checklogin. Checks to see if the user has logged in and sets the navbar accordingly
function checklogin() {
  let xhttp = new XMLHttpRequest();

  //Set up function that is called when reply received from server
  xhttp.onload = function () {
    let htmlStr = "";
    if (this.response !== '{"login": false}') {
      let curUser = JSON.parse(this.responseText);
      htmlStr += '<div class="container-fluid">';
      htmlStr += '<a class="navbar-brand" onclick="loadHome()">RestView</a>';
      htmlStr +=
        '<div class="collapse navbar-collapse justify-content-between" id="navbarNavAltMarkup">';
      htmlStr += '<div class="navbar-nav">';
      htmlStr +=
        '<a class="nav-link pages active" aria-current="page" onclick="loadHome()">Home</a>';
      htmlStr +=
        '<a class="nav-link pages" onclick="loadAddRestaurant()">Add Restaurant</a>';
      htmlStr +=
        '<a class="nav-link pages" onclick="loadMyProfile()">My Profile</a>';
      htmlStr += " </div>";

      htmlStr += '<div class="navbar-nav">';
      htmlStr += '<a class="nav-link" >Hello, ' + curUser + "!</a>";
      htmlStr += '<a class="nav-link pages" onclick="logOut()">Sign Out</a>';
      htmlStr += " </div>";
      htmlStr += " </div>";
      htmlStr += " </div>";

      navBar.innerHTML = htmlStr;
    } else {
      htmlStr += '<div class="container-fluid">';
      htmlStr += '<a class="navbar-brand" onclick="loadHome()">RestView</a>';
      htmlStr +=
        '<div class="collapse navbar-collapse justify-content-between" id="navbarNavAltMarkup">';
      htmlStr += '<div class="navbar-nav">';
      htmlStr +=
        '<a class="nav-link pages active" aria-current="page" onclick="loadHome()">Home</a>';
      htmlStr += " </div>";

      htmlStr += '<div class="navbar-nav">';
      htmlStr +=
        '<a class="nav-link pages" onclick="loadRegister()">Register</a>';
      htmlStr += '<a class="nav-link pages" onclick="loadLogin()">Login</a>';
      htmlStr += " </div>";
      htmlStr += " </div>";
      htmlStr += " </div>";

      navBar.innerHTML = htmlStr;
    }
  };
  //Send request to check if user is logged in
  xhttp.open("GET", "/checklogin", true);
  xhttp.send();
}

/* Posts a new user to the server. */
function register(event) {
  //Set up XMLHttpRequest
  let xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/registerUser", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  //Extract user data
  let usrName = document.getElementById("reg-name").value;
  let usrEmail = document.getElementById("reg-email").value;
  let usrPhone = document.getElementById("reg-phone").value;
  let usrPassword = document.getElementById("reg-password").value;
  let cPass = document.getElementById("cPass").value;

  //Create object with user data
  let user = {
    name: usrName,
    email: usrEmail,
    phone: usrPhone,
    password: usrPassword,
  };

  // condition to check for empty fields
  if (
    user.name === "" ||
    user.email === "" ||
    user.phone === "" ||
    user.password === "" ||
    cPass === ""
  ) {
    regShowToast(
      registerToast,
      "Please complete the registration form.",
      "ERROR!"
    );
    event.preventDefault();
  } else {
    // condition to check if the entered phone number is 10 digits
    if (isPhoneNumberValid(user.phone)) {
      // condition to check if the entered email is in correct format using the isEmailValid function
      if (isEmailValid(user.email)) {
        // making sure user confirms password before registering the user
        if (confirmPassword()) {
          userValidated = true;
        } else {
          regShowToast(
            registerToast,
            "Please confirm your passsword.",
            "ERROR!"
          );
          event.preventDefault();
        }
      } else {
        regShowToast(registerToast, "Please enter a valid address.", "ERROR!");
        event.preventDefault();
      }
    } else {
      regShowToast(
        registerToast,
        "Please enter a valid phone number.",
        "ERROR!"
      );
      event.preventDefault();
    }
    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function () {
      if (this.response === "{result: 'Customer added successfully'}") {
        regShowToast(registerToast, "Registration Successful!", "SUCCESS!");
        loadLogin();
      } else if (this.response === "{result: 'User exists'}") {
        regShowToast(
          registerToast,
          "Account Already Exists, Please Sign In.",
          "ERROR!"
        );
      } else {
        regShowToast(
          registerToast,
          "Registration Failed, Please Try Again.",
          "ERROR!"
        );
      }
    };

    if (userValidated === true) {
      xhttp.send(JSON.stringify(user));
      event.preventDefault();
    }
  }
  userValidated = false;
}

// logs the user in
function login() {
  //Set up XMLHttpRequest
  let xhttp = new XMLHttpRequest();

  //Extract user data
  let usrEmail = document.getElementById("login-email").value;
  let usrPassword = document.getElementById("login-password").value;

  //Create object with user data
  let user = {
    email: usrEmail,
    password: usrPassword,
  };

  if (user.email === "" || user.password === "") {
    loginShowToast(loginToast, "Please enter your credentials.", "ERROR!");
  } else {
    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        if (this.response !== '{"found":"false"}') {
          checklogin();
          loadHome();
        } else {
          loginShowToast(
            loginToast,
            "Incorrect username or password",
            "ERROR!"
          );
        }
      } else {
        loginShowToast(
          loginToast,
          "Something went wrong, please try again.",
          "ERROR!"
        );
      }
    };
    //Send request to log the user in and set the session
    xhttp.open("POST", "/loginUser", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));
  }
}

/* Posts a new restaurant to the server. */
function addReview() {
  //Extract review post data
  let restName = document.getElementById("rest-name").value;
  let restRating = document.getElementById("dropdown").value;
  let restImageArr = document.getElementById("image").files;
  let restReview = document.getElementById("review").value;
  let restLocation = document.getElementById("location").value;

  if (
    restName === "" ||
    restRating === "" ||
    restImageArr.length !== 1 ||
    restReview === "" ||
    restLocation === ""
  ) {
    addRestShowToast(addRestToast, "Please complete the form", "ERROR!");
  } else {
    //Put data inside FormData object
    const formData = new FormData();
    formData.append("name", restName);
    formData.append("rating", restRating);
    formData.append("img", restImageArr[0]);
    formData.append("review", restReview);
    formData.append("location", restLocation);

    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    xhttp.onload = () => {
      let imageResponse = JSON.parse(xhttp.responseText);
      if (xhttp.responseText === '{"result": "Post added successfully"}') {
        addRestShowToast(
          addRestToast,
          "Your review has been added!",
          "SUCCESS!"
        );
        loadHome();
      } else if ("error" in imageResponse) {
        addRestShowToast(
          addRestToast,
          "Please upload a PNG or JPG or JPEG file",
          "ERROR!"
        );
      } else {
        //Error from server
        addRestShowToast(
          addRestToast,
          "There was an error adding your review. Please try again.",
          "ERROR!"
        );
      }
    };

    //Send request to add the review
    xhttp.open("POST", "/addreview");
    xhttp.send(formData);
  }
}

// lets the user update their information
function updateUserInfo() {
  let usrName = document.getElementById("name").value;
  let usrEmail = document.getElementById("email").value;
  let usrPhone = document.getElementById("phone").value;
  let usrPassword = document.getElementById("password").value;

  if (
    usrName === "" ||
    usrEmail === "" ||
    usrPhone === "" ||
    usrPassword === ""
  ) {
    myProfileShowToast(myProfileToast, "Please complete the form", "ERROR!");
  } else {
    //Put data inside FormData object
    const formData = new FormData();
    formData.append("name", usrName);
    formData.append("email", usrEmail);
    formData.append("phone", usrPhone);
    formData.append("password", usrPassword);

    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
      if (xhttp.responseText === "{result: 'User updated successfully'}") {
        myProfileShowToast(
          myProfileToast,
          "Your account info has been updated!",
          "SUCCESS!"
        );
        loadMyProfile();
      } else {
        //Error from server
        myProfileShowToast(
          myProfileToast,
          "There was an error updating your account. Please try again.",
          "ERROR!"
        );
      }
    };

    //Send request to update user data in db
    xhttp.open("POST", "/updateuser");
    xhttp.send(formData);
  }
}

// getting user's information to be displayed in 'My Profile'
function getUserInfo() {
  //Set up XMLHttpRequest
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = () => {
    //Called when data returns from server
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      //Convert JSON to a JavaScript object
      let userArr = JSON.parse(xhttp.responseText);

      //Return if no user
      if (userArr.length === 0) {
        return;
      }

      let htmlStr = "";

      for (let key in userArr) {
        htmlStr += '<div class="form-row mt-2">';
        htmlStr += '<div class="col form-group">';
        htmlStr += "<label>Name</label>";
        htmlStr +=
          '<input name="name" type="text" value="' +
          userArr[key].name +
          '" class="form-control" placeholder="" id="name"/>';
        htmlStr += " </div>";
        htmlStr += '<div class="col form-group">';
        htmlStr += "<label>Email Address</label>";
        htmlStr +=
          '<input name="email" type="email" value="' +
          userArr[key].email +
          '" class="form-control" placeholder="" id="email" disabled/>';
        htmlStr += " </div>";
        htmlStr += " </div>";
        htmlStr += '<div class="form-group mt-2">';
        htmlStr += "<label>Phone Number</label>";
        htmlStr +=
          '<input name="phone" type="number" value="' +
          userArr[key].phone +
          '" class="form-control" placeholder="" id="phone"/>';
        htmlStr += " </div>";
        htmlStr += '<div class="form-group mt-2">';
        htmlStr += "<label>New password</label>";
        htmlStr +=
          '<input class="form-control" name="password" type="password" id="password" required/>';
        htmlStr += " </div>";
        htmlStr +=
          '<div class="form-group mt-3 d-flex justify-content-center">';
        htmlStr +=
          '<button name="update" type="submit" class="btn btn-primary rounded btn-block" onclick="updateUserInfo()">Update Information</button>';
        htmlStr += " </div>";
      }
      myProfileInfoDiv.innerHTML = htmlStr;
    }
  };

  //Request data for the signed in user (session is checked in the server)
  xhttp.open("GET", "/user", true);
  xhttp.send();
}

// getting past reviews of the user to be displayed in 'My Profile'
function getUserPostHistory() {
  //Set up XMLHttpRequest
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = () => {
    //Called when data returns from server
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      //Convert JSON to a JavaScript object
      let postArr = JSON.parse(xhttp.responseText);
      let htmlStr = "";

      //Return if no user
      if (postArr.length === 0) {
        postHistoryDiv.innerHTML = htmlStr;
        return;
      }

      let i = 0;
      for (let key in postArr) {
        i++;
        htmlStr += '<tr class="align-middle">';
        htmlStr += "<td style='vertical-align: middle'>" + i + "</td>";
        htmlStr += '<td class="w-25">';
        htmlStr +=
          '<img class="img-fluid" src="./uploads/' +
          postArr[key].rest_img +
          '" alt="' +
          postArr[key].rest_img +
          '" />';
        htmlStr += "</td>";
        htmlStr +=
          "<td style='vertical-align: middle'>" +
          postArr[key].rest_name +
          "</td>";
        htmlStr +=
          "<td style='vertical-align: middle'>" +
          postArr[key].post_date +
          "</td>";
        htmlStr += '<td class="text-center" style="vertical-align: middle">';
        htmlStr +=
          '<a class="btn btn-primary rounded p-3 m-2" onclick="loadUpdateRestaurant(' +
          postArr[key].post_id +
          ')">Update</a>';
        htmlStr +=
          '<a class="btn btn-primary rounded p-3 m-2" onclick="deletePost(' +
          postArr[key].post_id +
          ')">Delete</a>';
        htmlStr += "</td>";
        htmlStr += "</tr>";
      }
      postHistoryDiv.innerHTML = htmlStr;
    }
  };

  //Request data for all customers
  xhttp.open("GET", "/posts", true);
  xhttp.send();
}

// getting a specific post's info to let the user update the post using post_id
function getRestaurantInfo(post_id) {
  //Set up XMLHttpRequest
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = () => {
    //Called when data returns from server
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      //Convert JSON to a JavaScript object
      let updateRestArr = JSON.parse(xhttp.responseText);

      //Return if no restaurant
      if (updateRestArr.length === 0) {
        updateRestShowToast(updateRestToast, "No restaurant found.", "Error");
        return;
      }

      let htmlStr = "";

      for (let key in updateRestArr) {
        htmlStr += '<div class="col-6">';
        htmlStr += '<label class="h3 mt-2">Restaurant Name</label>';
        htmlStr +=
          '<input value="' +
          updateRestArr[key].rest_name +
          '" name="restaurant_name" type="text" class="form-control" placeholder="Restaurant Name" id="update-rest-name" required />';
        htmlStr += '<label class="h3 mt-2">Rating</label>';
        htmlStr +=
          '<select value="' +
          updateRestArr[key].rest_rating +
          '" name="rating" id="update-dropdown" class="form-select w-100" required >';
        htmlStr += '<option value="">-Select-</option>';
        htmlStr += '<option value="1">1</option>';
        htmlStr += '<option value="2">2</option>';
        htmlStr += '<option value="3">3</option>';
        htmlStr += '<option value="4">4</option>';
        htmlStr += '<option value="5">5</option>';
        htmlStr += "</select>";
        htmlStr += '<label class="h3 mt-2">Upload Restaurant Image</label>';
        htmlStr +=
          '<input type="file" name="imageToUpload" class="form-control" placeholder="Restaurant Image" id="update-image" required />';
        htmlStr += "</div>";

        htmlStr += '<div class="col-6">';
        htmlStr += '<label class="h3 mt-2">Review</label>';
        htmlStr +=
          '<textarea name="review" class="form-control resize-none textarea-height" style="height: 125px" placeholder="Review" id="update-review" required >' +
          updateRestArr[key].rest_review +
          "</textarea>";
        htmlStr += '<label class="h3 mt-2">Location</label>';
        htmlStr +=
          '<input value="' +
          updateRestArr[key].rest_location +
          '" name="location" type="text" class="form-control" placeholder="Location" id="update-location" required />';
        htmlStr += "</div>";
        htmlStr += '<div class="col-md-2 mt-5">';
        htmlStr +=
          '<button name="addrestaurant" type="submit" class="btn btn-primary rounded btn-block p-3" onclick="updateReview(' +
          updateRestArr[key].post_id +
          ')">Update Review</button>';
        htmlStr += "</div>";
      }
      updateRestaurantInfoDiv.innerHTML = htmlStr;
    }
  };

  //Request data for the specifc restaurant using post_id
  xhttp.open("GET", "/restaurants/" + post_id, true);
  xhttp.send();
}

// updating the post with the new values entered by the user in 'Update Restaurant'
function updateReview(post_id) {
  //Extract review data
  let restName = document.getElementById("update-rest-name").value;
  let restRating = document.getElementById("update-dropdown").value;
  let restImageArr = document.getElementById("update-image").files;
  let restReview = document.getElementById("update-review").value;
  let restLocation = document.getElementById("update-location").value;

  if (
    restName === "" ||
    restRating === "" ||
    restImageArr.length !== 1 ||
    restReview === "" ||
    restLocation === ""
  ) {
    updateRestShowToast(updateRestToast, "Please complete the form", "ERROR!");
  } else {
    //Put data inside FormData object
    const formData = new FormData();
    formData.append("name", restName);
    formData.append("rating", restRating);
    formData.append("img", restImageArr[0]);
    formData.append("review", restReview);
    formData.append("location", restLocation);

    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    xhttp.onload = () => {
      let imageResponse = JSON.parse(xhttp.responseText);
      if (xhttp.responseText === '{"result": "Post updated successfully"}') {
        updateRestShowToast(
          updateRestToast,
          "Your review has been updated!",
          "SUCCESS!"
        );
        loadHome();
      } else if ("error" in imageResponse) {
        updateRestShowToast(
          updateRestToast,
          "Please upload a PNG or JPG or JPEG file",
          "ERROR!"
        );
      } else {
        //Error from server
        updateRestShowToast(
          updateRestToast,
          "There was an error updating your review. Please try again.",
          "ERROR!"
        );
      }
    };

    //Send request to update the review of a specific post using post_id
    xhttp.open("POST", "/updatereview/" + post_id, true);
    xhttp.send(formData);
  }
}

// deleting a specific post using post_id
function deletePost(post_id) {
  //Set up XMLHttpRequest
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = () => {
    if (xhttp.responseText === '{"result": "Post deleted successfully"}') {
      myProfileShowToast(
        myProfileToast,
        "Post deleted successfully.",
        "SUCCESS!"
      );
      loadMyProfile();
    } else {
      myProfileShowToast(
        myProfileToast,
        "You post was not deleted, please try again.",
        "ERROR!"
      );
    }
  };
  //Send request to delete a specific post using post_id
  xhttp.open("POST", "/deletepost/" + post_id, true);
  xhttp.send();
}

// function to check if the password and confirm password fields match
function confirmPassword() {
  let pass = document.getElementById("reg-password").value;
  let cPass = document.getElementById("cPass").value;

  // condition to compare the passwords
  if (pass === cPass) {
    return true;
  } else {
    return false;
  }
}

// condition to check for 10 digits in phone number
function isPhoneNumberValid(phoneNum) {
  // checking using regular expressions
  var phoneNumberChars = /^\d{10}$/;
  if (phoneNum.match(phoneNumberChars)) {
    return true;
  } else {
    return false;
  }
}

// condition to check email format
// TO TEST THE FUNCTION, PLEASE 'export' THE FUNCTION FIRST
// CANNOT KEEP THE FUNCTION EXPORTED AS IT CAUSES ISSUES FOR SOME REASON
function isEmailValid(email) {
  // checking mail format using regular expressions
  let mailCharacters = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email.match(mailCharacters)) {
    return true;
  } else {
    return false;
  }
}

// shows error or success messages on 'Registration'
function regShowToast(toastType, message, heading) {
  regMsg.innerHTML = message;
  regHeading.innerHTML = heading;

  toastType.style.display = "block";
}

// shows error or success messages on 'Login'
function loginShowToast(toastType, message, heading) {
  loginMsg.innerHTML = message;
  loginHeading.innerHTML = heading;

  toastType.style.display = "block";
}

// shows error or success messages on 'Add Restaurant'
function addRestShowToast(toastType, message, heading) {
  addRestMsg.innerHTML = message;
  addRestHeading.innerHTML = heading;

  toastType.style.display = "block";
}

// shows error or success messages on an individual post
function restShowToast(toastType, message, heading) {
  restMsg.innerHTML = message;
  restHeading.innerHTML = heading;

  toastType.style.display = "block";
}

// shows error or success messages on 'My Profile'
function myProfileShowToast(toastType, message, heading) {
  myProfileMsg.innerHTML = message;
  myProfileHeading.innerHTML = heading;

  toastType.style.display = "block";
}

// shows error or success messages on 'Update Restaurant'
function updateRestShowToast(toastType, message, heading) {
  updateRestMsg.innerHTML = message;
  updateRestHeading.innerHTML = heading;

  toastType.style.display = "block";
}
