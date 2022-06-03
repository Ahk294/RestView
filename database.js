//Import the mysql module and create a connection pool with user details
const mysql = require("mysql");
const connectionPool = mysql.createPool({
  connectionLimit: 1,
  host: "localhost",
  user: "dg",
  password: "123456",
  database: "restview",
  debug: false,
});

//Adds a new customer to database
exports.register = (userExists, name, email, phone, password, response) => {
  // registering the user only if the user is new
  if (!userExists) {
    //Build query
    let sql =
      "INSERT INTO users (name, email, phone, password) " +
      "VALUES ('" +
      name +
      "','" +
      email +
      "','" +
      phone +
      "','" +
      password +
      "')";

    //Execute query
    connectionPool.query(sql, (err, result) => {
      if (err) {
        //Check for errors
        let errMsg = "{Error: " + err + "}";
        console.error(errMsg);
        response.status(400).json(errMsg);
      } else {
        //Send back result
        response.send("{result: 'Customer added successfully'}");
      }
    });
  } else {
    response.send("{result: 'User exists'}");
  }
};

// async function to simultaneously check if the user exists in the db or not while registering the user
async function checkUser(email) {
  let sql = "SELECT * FROM users where email = '" + email + "'";

  let user = [];

  let selectPromise = new Promise((resolve, reject) => {
    connectionPool.query(sql, (err, result) => {
      if (err) {
        reject("Error executing query: " + JSON.stringify(err));
      } else {
        resolve(result);
      }
    });
  });

  try {
    user = await selectPromise;
  } catch (err) {
    console.error(JSON.stringify(err));
  }

  if (user.length === 0) {
    return false;
  } else {
    return true;
  }
}

// async function to get the user information from the db while logging in the user, also acts as credential validation
async function getUser(email, password) {
  let sql =
    "SELECT * FROM users where email = '" +
    email +
    "' && password = '" +
    password +
    "'";

  let user = [];

  let selectPromise = new Promise((resolve, reject) => {
    connectionPool.query(sql, (err, result) => {
      if (err) {
        reject("Error executing query: " + JSON.stringify(err));
      } else {
        resolve(result);
      }
    });
  });

  try {
    user = await selectPromise;
  } catch (err) {
    console.error(JSON.stringify(err));
  }
  return user;
}

// adds a new post to the db
exports.newPost = (author, name, rating, image, review, location, response) => {
  // getting the current date
  let postDate = new Date().toLocaleDateString();

  //Build query
  let sql =
    "INSERT INTO posts (post_date, user_email, rest_name, rest_rating, rest_img, rest_review, rest_location) " +
    "VALUES ('" +
    postDate +
    "','" +
    author +
    "','" +
    name +
    "','" +
    rating +
    "','" +
    image +
    "','" +
    review +
    "','" +
    location +
    "')";

  //Execute query
  connectionPool.query(sql, (err, result) => {
    if (err) {
      //Check for errors
      let errMsg = "{Error: " + err + "}";
      response.send(errMsg);
    } else {
      //Send back result
      response.send('{"result": "Post added successfully"}');
    }
  });
};

// updating a post using its post_id
exports.updatePost = (
  post_id,
  author,
  name,
  rating,
  image,
  review,
  location,
  response
) => {
  let postDate = new Date().toLocaleDateString();

  //Build query
  let sql =
    "UPDATE posts SET post_date='" +
    postDate +
    "', user_email='" +
    author +
    "', rest_name='" +
    name +
    "', rest_rating='" +
    rating +
    "', rest_img='" +
    image +
    "', rest_review='" +
    review +
    "', rest_location='" +
    location +
    "' WHERE post_id='" +
    post_id +
    "'";

  //Execute query
  connectionPool.query(sql, (err, result) => {
    if (err) {
      //Check for errors
      let errMsg = "{Error: " + err + "}";
      response.send(errMsg);
    } else {
      //Send back result
      response.send('{"result": "Post updated successfully"}');
    }
  });
};

// deleting a post using its post_id
exports.deletePost = (post_id, response) => {
  //Build query
  let sql = "DELETE FROM posts WHERE post_id='" + post_id + "'";

  // tried to implement deletion of the post using INNER JOIN, but does not work on posts with no comments.
  // Deleting posts and its comments using INNER JOIN
  // let sql =
  //   "DELETE posts, comments " +
  //   "FROM posts " +
  //   "INNER JOIN comments ON posts.post_id = comments.post_id " +
  //   "WHERE posts.post_id='" +
  //   post_id +
  //   "'";

  //Execute query
  connectionPool.query(sql, (err, result) => {
    if (err) {
      //Check for errors
      let errMsg = "{Error: " + err + "}";
      response.send(errMsg);
    } else {
      //Send back result
      response.send('{"result": "Post deleted successfully"}');
    }
  });
};

// adds a new comment to the db
exports.newComment = (comment, author, post_id, response) => {
  let commentDate = new Date().toLocaleDateString();

  //Build query
  let sql =
    "INSERT INTO comments (comment, comment_date, user_email, post_id) " +
    "VALUES ('" +
    comment +
    "','" +
    commentDate +
    "','" +
    author +
    "','" +
    post_id +
    "')";

  //Execute query
  connectionPool.query(sql, (err, result) => {
    if (err) {
      //Check for errors
      let errMsg = "{Error: " + err + "}";
      console.error(errMsg);
      response.status(400).json(errMsg);
    } else {
      //Send back result
      response.send('{"result": "Comment added successfully"}');
    }
  });
};

// gets all the posts from the db
exports.getAllRestaurants = (response) => {
  //Build query
  let sql = "SELECT * FROM posts";

  //Execute query
  connectionPool.query(sql, (err, result) => {
    if (err) {
      //Check for errors
      let errMsg = "{Error: " + err + "}";
      console.error(errMsg);
      response.status(400).json(errMsg);
    } else {
      //Return results in JSON format
      response.send(JSON.stringify(result));
    }
  });
};

// gets only a specific post using post_id
exports.getOneRestaurant = (post_id, response) => {
  //Build query
  let sql = "SELECT * FROM posts where post_id = " + post_id;

  //Execute query
  connectionPool.query(sql, (err, result) => {
    if (err) {
      //Check for errors
      let errMsg = "{Error: " + err + "}";
      console.error(errMsg);
      response.status(400).json(errMsg);
    } else {
      //Return results in JSON format
      response.send(JSON.stringify(result));
    }
  });
};

// gets all comments from the db that are related to a specific post using post_id
exports.getAllComments = (post_id, response) => {
  //Build query
  let sql = "SELECT * FROM comments where post_id = " + post_id;

  //Execute query
  connectionPool.query(sql, (err, result) => {
    if (err) {
      //Check for errors
      let errMsg = "{Error: " + err + "}";
      console.error(errMsg);
      response.status(400).json(errMsg);
    } else {
      //Return results in JSON format
      response.send(JSON.stringify(result));
    }
  });
};

// gets a specific user's information using email
exports.getUserInfo = (email, response) => {
  //Build query
  let sql = "SELECT * FROM users WHERE email= '" + email + "'";

  //Execute query
  connectionPool.query(sql, (err, result) => {
    if (err) {
      //Check for errors
      let errMsg = "{Error: " + err + "}";
      console.error(errMsg);
      response.status(400).json(errMsg);
    } else {
      //Return results in JSON format
      response.send(JSON.stringify(result));
    }
  });
};

// updates the information of a specific user using email
exports.updateUserInfo = (name, email, phone, password, response) => {
  //Build query
  let sql =
    "UPDATE users SET name = '" +
    name +
    "', phone = '" +
    phone +
    "', password = '" +
    password +
    "' WHERE email = '" +
    email +
    "'";

  //Execute query
  connectionPool.query(sql, (err, result) => {
    if (err) {
      //Check for errors
      let errMsg = "{Error: " + err + "}";
      console.error(errMsg);
      response.status(400).json(errMsg);
    } else {
      //Send back result
      response.send("{result: 'User updated successfully'}");
    }
  });
};

// gets a specific user's posts using email
exports.getUserPosts = (email, response) => {
  //Build query
  let sql = "SELECT * FROM posts where user_email = '" + email + "'";

  //Execute query
  connectionPool.query(sql, (err, result) => {
    if (err) {
      //Check for errors
      let errMsg = "{Error: " + err + "}";
      console.error(errMsg);
      response.status(400).json(errMsg);
    } else {
      //Return results in JSON format
      //console.log(JSON.stringify(result));
      response.send(JSON.stringify(result));
    }
  });
};

// exporting the async functions to be used in server.js
module.exports.getUser = getUser;
module.exports.checkUser = checkUser;
