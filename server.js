//Import the necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const fileUpload = require("express-fileupload");

//Import database functions
const db = require("./database");
const { json, type } = require("express/lib/response");

//Create express app and configure it with body-parser
const app = express();
app.use(bodyParser.json());
//Configure Express to use the file upload module
app.use(fileUpload());
//Configure express to use express-session
app.use(
  expressSession({
    secret: "cst2120 secret",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: true,
  })
);
//Set up express to serve static files from the directory called 'public'
app.use(express.static("public"));

//Set up application to handle GET requests
app.get("/checklogin", checkLogin);
app.get("/logout", logOut);
app.get("/restaurants", getRestaurants);
app.get("/restaurants/*", getSingleRestaurant);
app.get("/comments/*", getPostComments);
app.get("/user", getUser);
app.get("/posts", getPosts);

//Set up application to handle POST requests
app.post("/registerUser", registerUser);
app.post("/loginUser", loginUser);
app.post("/addreview", addPost);
app.post("/updatereview/*", updatePost);
app.post("/deletepost/*", deletePost);
app.post("/addcomment", addComment);
app.post("/updateuser", updateUser);

// GET /logout. Logs out the user
function logOut(request, response) {
  //Destroy session.
  request.session.destroy((err) => {
    if (err) {
      response.send('{"error": ' + JSON.stringify(err) + "}");
    } else {
      response.send('{"login": false}');
    }
  });
}

// GET /checklogin. Checks to see if the user has logged in
function checkLogin(request, response) {
  if (!("email" in request.session)) {
    response.send('{"login": false}');
    return false;
  } else {
    let user = request.session.email;
    response.send(JSON.stringify(user));
    return true;
  }
}

// GET /restaurants. Gets all the posts/reviews/restaurants
function getRestaurants(request, response) {
  //Split the path of the request into its components
  var pathArray = request.url.split("/");

  //Get the last part of the path
  var pathEnd = pathArray[pathArray.length - 1];

  //If path ends with 'restaurants' we return all restaurants
  if (pathEnd === "restaurants") {
    //Call function to return all restaurants
    db.getAllRestaurants(response);
  } else {
    //The path is not recognized. Return an error message
    response.send("{error: 'Path not recognized'}");
  }
}

// GET /restaurants/*. Gets a particular post/review/restaurant
function getSingleRestaurant(request, response) {
  //Split the path of the request into its components
  var pathArray = request.url.split("/");

  //Get the last part of the path
  var pathEnd = pathArray[pathArray.length - 1];

  //If path ends with 'restaurants' we return all restaurants
  if (pathEnd === "restaurants") {
    //The path is not recognized. Return an error message
    response.send("{error: 'Path not recognized'}");
  } else {
    let post_id = parseInt(pathEnd);
    db.getOneRestaurant(post_id, response);
  }
}

// GET /comments/*. Gets the comments of a particular post/review/restaurant
function getPostComments(request, response) {
  //Split the path of the request into its components
  var pathArray = request.url.split("/");

  //Get the last part of the path
  var pathEnd = pathArray[pathArray.length - 1];

  //If path ends with 'restaurants' we return all restaurants
  if (pathEnd === "comments") {
    //The path is not recognized. Return an error message
    response.send("{error: 'Path not recognized'}");
  } else {
    let post_id = parseInt(pathEnd);
    db.getAllComments(post_id, response);
  }
}

// GET /user. Gets the currently logged in user
function getUser(request, response) {
  let curUser = request.session.email;

  db.getUserInfo(curUser, response);
}

// GET /posts. Gets all the posts/reviews/restaurants of the currently logged in user
function getPosts(request, response) {
  let curUser = request.session.email;

  db.getUserPosts(curUser, response);
}

// POST /registeruser. Confirms if the user is new and then registers them
async function registerUser(request, response) {
  //Extract customer data
  let newUser = request.body;

  let userExists = await db.checkUser(newUser.email);

  //Call function to add new customer
  db.register(
    userExists,
    newUser.name,
    newUser.email,
    newUser.phone,
    newUser.password,
    response
  );
}

// POST /loginuser. Confirms if the user is registered and then logs them in
async function loginUser(request, response) {
  let usrlogin = request.body;
  let user = JSON.stringify(
    await db.getUser(usrlogin.email, usrlogin.password)
  );

  if (user != "[]") {
    let users = JSON.parse(user);
    request.session.email = users[0].email;
    response.send('{"found":"true","users":' + user + "}");
  } else {
    response.send('{"found":"false"}');
  }
}

// POST /addreview. Creates a new post/review/restaurant
function addPost(request, response) {
  let restaurant = request.body;
  let author = request.session.email;
  //Check to see if a file has been submitted on this path
  if (!request.files || Object.keys(request.files).length === 0) {
    return response
      .status(400)
      .send('{"upload": false, "error": "Image missing"}');
  }

  // The name of the input field (i.e. "myFile") is used to retrieve the uploaded file
  let image = request.files.img;

  //CHECK THAT IT IS AN IMAGE FILE, NOT AN .EXE ETC.
  if (
    image.mimetype === "image/png" ||
    image.mimetype === "image/jpg" ||
    image.mimetype === "image/jpeg"
  ) {
    /* Use the mv() method to place the file in the folder called 'uploads' in the public folder.
    This is in the current directory */
    image.mv("./public/uploads/" + image.name, function (err) {
      if (err) {
        return response
          .status(500)
          .send(
            '{"filename": "' +
              image.name +
              '", "upload": false, "error": "' +
              JSON.stringify(err) +
              '"}'
          );
      } else {
        //Send back confirmation of the upload to the client.
        db.newPost(
          author,
          restaurant.name,
          restaurant.rating,
          image.name,
          restaurant.review,
          restaurant.location,
          response
        );
      }
    });
  } else {
    response.send(
      '{"filename": "' +
        image.name +
        '", "upload": false, "error": "Format not supported"}'
    );
  }
}

// POST /updatereview/*. Updates a particular post/review/restaurant
function updatePost(request, response) {
  let restaurant = request.body;
  let author = request.session.email;
  let post_id;

  //Split the path of the request into its components
  var pathArray = request.url.split("/");

  //Get the last part of the path
  var pathEnd = pathArray[pathArray.length - 1];

  //If path ends with 'restaurants' we return all restaurants
  if (pathEnd === "updatereview") {
    //The path is not recognized. Return an error message
    response.send("{error: 'Path not recognized'}");
  } else {
    post_id = parseInt(pathEnd);
  }

  //Check to see if a file has been submitted on this path
  if (!request.files || Object.keys(request.files).length === 0) {
    return response
      .status(400)
      .send('{"upload": false, "error": "Image missing"}');
  }

  // The name of the input field (i.e. "myFile") is used to retrieve the uploaded file
  let image = request.files.img;

  //CHECK THAT IT IS AN IMAGE FILE, NOT AN .EXE ETC.
  if (
    image.mimetype === "image/png" ||
    image.mimetype === "image/jpg" ||
    image.mimetype === "image/jpeg"
  ) {
    /* Use the mv() method to place the file in the folder called 'uploads' in the public folder.
    This is in the current directory */
    image.mv("./public/uploads/" + image.name, function (err) {
      if (err) {
        return response
          .status(500)
          .send(
            '{"filename": "' +
              image.name +
              '", "upload": false, "error": "' +
              JSON.stringify(err) +
              '"}'
          );
      } else {
        //Send back confirmation of the upload to the client.
        db.updatePost(
          post_id,
          author,
          restaurant.name,
          restaurant.rating,
          image.name,
          restaurant.review,
          restaurant.location,
          response
        );
      }
    });
  } else {
    response.send(
      '{"filename": "' +
        image.name +
        '", "upload": false, "error": "Format not supported"}'
    );
  }
}

// POST /deletepost/*. Deletes a particular post/review/restaurant
function deletePost(request, response) {
  let post_id;
  //Split the path of the request into its components
  var pathArray = request.url.split("/");

  //Get the last part of the path
  var pathEnd = pathArray[pathArray.length - 1];

  //If path ends with 'restaurants' we return all restaurants
  if (pathEnd === "deletepost") {
    //The path is not recognized. Return an error message
    response.send("{error: 'Path not recognized'}");
  } else {
    post_id = parseInt(pathEnd);
  }

  db.deletePost(post_id, response);
}

// POST /addcomment. Adds a comment of the currently logged in user to a particular post/review/restaurant
function addComment(request, response) {
  if (!("email" in request.session)) {
    response.send('{"result": "Please login to add a comment."}');
  } else {
    let comment = request.body;
    let author = request.session.email;

    db.newComment(comment.comment, author, comment.post_id, response);
  }
}

// POST /updateuser. Allows the logged in user to update their profile
function updateUser(request, response) {
  //Extract customer data
  let user = request.body;

  //Call function to add new customer
  db.updateUserInfo(user.name, user.email, user.phone, user.password, response);
}

//Start the app listening on port 8080
app.listen(8080);

//Export server for testing
module.exports = app;
