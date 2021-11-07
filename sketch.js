var dog, sadDog, happyDog, database;
var foodS, foodStock;
var addFood;
var foodObj;

//create feed and lastFed variable here
var feed, lastFed;

function preload() {
  sadDog = loadImage("Dog.png");
  happyDog = loadImage("happy dog.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 400);

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  fedTime = database.ref('FeedTime');

  dog = createSprite(800, 200, 150, 150);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  //create feed the dog button here
  feed = createButton("Feed the dog");
  feed.position(400, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(900, 95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46, 139, 87);
  foodObj.display();

  //write code to read fedtime value from the database 
  fedTime.on("value", function (data) {
    lastFed = data.val();
  });

  //write code to display text lastFed time here
  textSize(25);
  fill("black");

  if (lastFed > 12) {
    text(`Last Feed : ${lastFed - 12} PM`, 370, 30);
  } else if (lastFed == 0) {
    text(`Last Feed : 12 AM`, 370, 30);
  } else if (lastFed == 12) {
    text(`Last Feed : 12 PM`, 370, 30);
  } else {
    text(`Last Feed : ${lastFed} AM`, 370, 30);
  }

  drawSprites();
}

//function to read food Stock
function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog() {
  dog.addImage(happyDog);

  //write code here to update food stock and last fed time
  var valueFood = foodObj.getFoodStock();
  if (valueFood <= 0) {
    foodObj.updateFoodStock(valueFood * 0);
  } else {
    foodObj.updateFoodStock(valueFood - 1);
  }

  database.ref('/').update({
    FeedTime: hour(),
    Food: foodObj.getFoodStock()
  })
}

//function to add food in stock
function addFoods() {
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}
