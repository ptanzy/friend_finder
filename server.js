var express = require("express");
var path = require("path");

// Sets up the Express App
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


var friends = [
  {
    "name": "Tom From MySpace",
    "photo": "https://a4-images.myspacecdn.com/images01/8/cb15586538fb826bb1eee34167065887/full.jpg",
    "scores": ["5","1","4","4","5","1","2","5","4","1"]
  }
];

// Routes
// =============================================================
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/survey", function(req, res) {
  res.sendFile(path.join(__dirname, "survey.html"));
});

app.get("/api/friends", function(req, res) {
  return res.json(friends);
});



// Create New Characters - takes in JSON input
app.post("/api/friends", function(req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
  var user = req.body;
  console.log(user); 
  var closestMatch = friends[0];
  var matchDif = compareFriendScores(user.scores, closestMatch.scores);
  for(var i = 1; i<friends.length; i++){
    //if the user and current friend are the same then skip it
    //because we don't want the user to match themselves.
    if(user.name === friends[i].name){
      continue;
    }
    dif = compareFriendScores(user.scores, friends[i]);
    if(dif < matchDif){
      closestMatch  = friends[i];
      matchDif = dif;
    }
  }

  // We then add the json the user sent to the character array
  friends.push(user);

  // We then display the JSON to the users
  res.json(closestMatch);
});

//Helper for post/api/friends
function compareFriendScores(scores, friendScores){
  var scoresDif = 0;
  for(var i = 0; i<friendScores.length; i++){
    scoresDif += Math.abs(scores[i] - friendScores[i]);
  }
  return scoresDif;
}

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});