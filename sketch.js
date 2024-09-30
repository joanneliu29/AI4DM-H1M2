// Classifier Variables for Fruit Recognition
let classifier;
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/WB0zBXNEQ/';
let video;
let label = "Waiting for the TM model...";
let cal = "";

// Hand Pose Variables
let handPose;
let hands = [];
let fingersCount = 0; // To store the number of detected fingers
let handedness = ""; // To store whether it's a left or right hand

// Recipe Suggestions based on Fruit and Fingers
let recipe = "";

// Load both models: HandPose and Image Classifier
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);

  // Create the video
  video = createCapture(VIDEO, { flipped: false });
  video.size(width, height);
  video.hide();

  // Start hand pose detection
  handPose.detectStart(video, gotHands);

  // Start fruit classification
  classifyVideo();
}

function draw() {
  background(0);

  // Draw the video
  image(video, 0, 0, width, height);
  
  // Draw a black box at the bottom for text
  fill(0); // Black color for the box
  noStroke(); // No border around the box
  rect(0, height - 80, width, 80); // Black rectangle at the bottom

  // Set white text on top of the black box
  fill(255);
  textSize(16);
  textAlign(CENTER);

  // Draw the fruit classification label
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 10);

  // Draw all the tracked hand points and count fingers
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    fingersCount = 0; // Reset fingers count for each hand
    handedness = hand.handedness; // Get if the hand is left or right
    
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 10);
    }

    // Check the extended fingers based on hand type (Left/Right)
    fingersCount = countFingers(hand, handedness); // Count the fingers on the hand
  }

  // Display the number of fingers detected and hand type
  fill(255);
  text(`Fingers: ${fingersCount}`, width / 2, height - 30);

  // Suggest a recipe based on the detected fruit and fingers count
  textSize(20);
  textAlign(CENTER);
  text("Recipe Suggestion: " + recipe, width / 2, height - 50);
}

// Start fruit classification from the video
function classifyVideo() {
  classifier.classifyStart(video, gotResult);
}

// When we get a result from fruit classification
function gotResult(results) {

  let fruit = results[0].label;

  // Assign calories based on the recognized fruit
  if (fruit === "Banana") cal = "105";
  else if (fruit === "Pear") cal = "102";
  else if (fruit === "Orange") cal = "45";
  else if (fruit === "Apple") cal = "95";
  else if (fruit === "Plum") cal = "30";
  else if (fruit === "Blueberry") cal = "2";
  else cal = "Unknown";

  // Update the label
  label = `${fruit} - ${cal} calories`;

  // Suggest recipe based on fruit and fingers
  suggestRecipe(fruit, fingersCount);


}

// Callback function for when handPose outputs data
function gotHands(results) {
  hands = results;
}

// Function to count extended fingers based on hand keypoints and hand orientation
function countFingers(hand, handedness) {
  let count = -1;
  // Thumb and other fingers have specific keypoints for tip detection
  let fingerTips = [4, 8, 12, 16, 20]; // Indices for finger tips in hand keypoints

  for (let i = 0; i < fingerTips.length; i++) {
    let tip = hand.keypoints[fingerTips[i]];
    let dip = hand.keypoints[fingerTips[i] - 2]; // Lower joint on each finger
    if (tip.y < dip.y) { // If the tip is above the lower joint, the finger is extended
      count++;
      if (count == 4) {
        if(handedness === "Right" && hand.keypoints[4].x<hand.keypoints[8].x || handedness === "Left" && hand.keypoints[4].x>hand.keypoints[8].x){
          count++;
        }
      }
    }
  }

  return count;
}

// Function to suggest a recipe based on fruit and number of fingers detected
function suggestRecipe(fruit, fingers) {
  // Simple recipe suggestion logic based on fruit and fingers count
  if (fruit === "Banana") {
    if (fingers === 1) recipe = "Banana Smoothie (105 Calories)";
    else if (fingers === 2) recipe = "Banana Pancakes (210 Calories)";
    else if (fingers === 3) recipe = "Banana Bread (315 Calories)";
    else if (fingers === 4) recipe = "Bigger Banana Bread (420 Calories)";
    else if (fingers === 5) recipe = "Biggest Banana Bread (525 Calories)";
    else if (fingers === 0) recipe = "No recipe available";
  } else if (fruit === "Apple") {
    if (fingers === 1) recipe = "Apple Pie (95 Calories)";
    else if (fingers === 2) recipe = "Caramelized Apples (190 Calories)";
    else if (fingers === 3) recipe = "Apple Crumble (285 Calories)";
    else if (fingers === 4) recipe = "Bigger Apple Crumble (380 Calories)";
    else if (fingers === 5) recipe = "Biggest Apple Crumble (475 Calories)";
    else if (fingers === 0) recipe = "No recipe available";
  } else if (fruit === "Orange") {
    if (fingers === 1) recipe = "Orange Juice (45 Calories)";
    else if (fingers === 2) recipe = "Orange Marmalade (90 Calories)";
    else if (fingers === 3) recipe = "Orange Cake (135 Calories)";
    else if (fingers === 4) recipe = "Bigger Orange Cake (180 Calories)";
    else if (fingers === 5) recipe = "Biggest Orange Cake (225 Calories)";
    else if (fingers === 0) recipe = "No recipe available";
  } else if (fruit === "Pear") {
    if (fingers === 1) recipe = "Pear Salad (102 Calories)";
    else if (fingers === 2) recipe = "Baked Pears (204 Calories)";
    else if (fingers === 3) recipe = "Pear Tart (306 Calories)";
    else if (fingers === 4) recipe = "Bigger Pear Tart (408 Calories)";
    else if (fingers === 5) recipe = "Biggest Pear Tart (510 Calories)";
    else if (fingers === 0) recipe = "No recipe available";
  } else if (fruit === "Plum") {
    if (fingers === 1) recipe = "Plum Jam (30 Calories)";
    else if (fingers === 2) recipe = "Plum Sorbet (60 Calories)";
    else if (fingers === 3) recipe = "Plum Cake (90 Calories)";
    else if (fingers === 4) recipe = "Bigger Plum Cake (120 Calories)";
    else if (fingers === 5) recipe = "Biggest Plum Cake (150 Calories)";
    else if (fingers === 0) recipe = "No recipe available";
  } else if (fruit === "Blueberry") {
    if (fingers === 1) recipe = "Blueberry Smoothie (10 Calories)";
    else if (fingers === 2) recipe = "Blueberry Muffins (60 Calories)";
    else if (fingers === 3) recipe = "Blueberry Pie (90 Calories)";
    else if (fingers === 4) recipe = "Bigger Blueberry Pie (120 Calories)";
    else if (fingers === 5) recipe = "Biggest Blueberry Pie (150 Calories)";
    else if (fingers === 0) recipe = "No recipe available";
  } else {
    recipe = "No recipe available";
  }
}
