let firstRun = true; //image preload

//animated face paramaters
let faceFrames = [];       //setting up animation using array of images
let pinkfaceFrames = [];       //setting up animation using array of images
let faceImageAmount = 24; //total images in array
let currentImage = 0; // current image in foreloop
let img;

//moire
let lineAmountX= 200; //amount of lines
let lineAmountY= 200;

// let lineSpace = 15; //20 for body, 40 for inro
let textureNoiseCounter = 2;
let strokeWeightNoiseCounter = 2;
let angleCounter = 20;
let noiseMap1 = -5;
let noiseMap2 = 100;
//4,5, -30,100, -5,100
let waveScale = 200;
///20
let wavesOffamount =40;
//400,40

// moire layer controls
let wavesShape = "line"; //setting it up for the option to add rectangles or ellipses etc
let moireLayers = 1;     // how many layers of moire, to give different variations during song
let moireVisible = true; // a paramater to turn on and off the moire layers to get pauses that match drum pauses in the song etc.

let blueMoireLayerCenter; // a paramater to make sure the blue layer is always on screen

//rasterisation variables , not sure if I will use but keeping for now
let gridsX = 20;
let gridsY =gridsX;

let pink, blue, pg;

function draw_one_frame(words, vocal, drum, bass, other, counter) {
  background(0,0,255);
  angleMode(DEGREES);

  let seconds = counter/60;

  // if statements that control whether a moire layer is visible, what shape it is and how many moire layers
  //based on seconds which is controlled by the counter variable/60

  //lines
  if (seconds < 87) { //intro
    wavesShape = "line";
    moireLayers = 1;
    moireVisible = true;
  }
  if (seconds >= 87 && seconds < 88) { //pause before first body
    moireVisible = false;
  }
  if (seconds >= 88 && seconds < 109.5) { // First 16 bars of body
    wavesShape = "line";
    moireLayers = 1;
    moireVisible = true;
  }
  if (seconds >= 109.5 && seconds < 110) { //brief pause before the second 16
    moireVisible = false;
  }
  if (seconds >= 110 && seconds < 132) { //second 16
    wavesShape = "line";
    moireLayers = 2;
    moireVisible = true;
  }
  if (seconds >= 132 && seconds < 135) { //pause bofore 3rd 16
    moireVisible = false;
  }
  
  //rectangles
  if (seconds >= 135 && seconds < 154) { //3rd 16
    wavesShape = "rect";
    moireLayers = 1;
    moireVisible = true;
  }
  if (seconds >= 154 && seconds < 155.5) { //puase before 4th 16
    wavesShape = "rect";   
    moireLayers = 1;
    moireVisible = true;
  }
  if (seconds >= 155.5 && seconds < 157) { //4th 16
    moireVisible = false;
  }
  if (seconds >= 157) { //rest of song-needs to be updated and worked on as I go
    wavesShape = "rect";   
    moireLayers = 2;
    moireVisible = true;
  }

  // For blue moire layers
  blueMoireLayerCenter = (counter * 0.1) % 360;  // I was having issues with the blue layer rotating off screen since it was tied to counter and it kept going. I added a modulo so that it never goes out of 360 degrees

  if (counter > 0) { //making it so that the animation only happens when the song is playing

    let pink = color(255, 25, 104); //colours used
    let blue = color(0,0,255);
    let grey = color(120);

    let seconds = counter/60; //variable to make it easier to track time

    //face layer
    if( seconds >21.26){ //testing out the time based approach of bringing in face layer only when vocals play
      faceLayer(); //
    }

    blendMode(BURN); // this sets the overlay below to blend with the face layer in a high contrast way

    let vocalBlend= map(vocal,40,60,0,1); //mapping the vocal values to the blend value of the faceColour lerpColor below
    let faceColour = lerpColor(grey,blue,vocalBlend); //lerpColour to create glitchy desaturated effect

    //colour overlay to get that glitchy desaturated effect
    fill(faceColour,100); 
    noStroke();
    rect(0, 0, width, height);

    blendMode(BLEND); //this resets the blendMode back to normal so it doesn't effect other layers

    // if statements to draw the moires 
    if (moireVisible) { //if statement for ability to have pauses and continuity
      if (moireLayers === 1) { // if statement for what is visible 1 moire layer, just the pink layer
        push();
        Moire(seconds, pink, 'pink'); 
        pop();
      } 
      else if (moireLayers === 2) { //if statement for what is visible for two moire layers
        push(); //pink layer
        Moire(seconds, pink, 'pink');
        pop();
       
        push(); //blue layer
        translate(width/2, height/2); //putting the blue layer more centered
        rotate(counter * 0.1);// speed of rotation of blue layer is mapped to counter
        Moire(seconds, blue, 'blue', true); // tells Moire not to translate again
        pop();
      }
    } 
    else { // when moire is not visible, this calls away the moire modulators to keep going, so that the animation remains continous but invisible and matches the song. This way it doesn't stop and then start again its just invisible, leading to no timing issues
      MoireModulators(); //calls away the function that has the parameters that modulate the waves for the moire function
      if (moireLayers === 2) { //if 2 layers image the mire modulators twice
        MoireModulators();
        MoireModulators();
      } 
      else { //if moire layers =1 just image the moireModulators once
        MoireModulators();
      }
    }

    //led screen effect overlay
    let tilesX= 1920/8; //setting the ledscreen dots based on my sketch size
    let tilesY=1080/8;
    let tileW = width / tilesX; //setting up the amount of ellipses in the for loop
    let tileH = height / tilesY;

    for (let x = 0; x < tilesX; x++) { 
      for (let y = 0; y < tilesY; y++) {
        fill(40,90); //reducing the opacity a little bit to retain the face better and make it look like it is on a screen
        ellipse(x * tileW, y * tileH, tileW, tileH);
      }
    }
  }
}

function Moire(seconds, moireColour, layerSelect, noTranslate) {
  pink = color(237, 25, 104); 
  blue = color(0, 0, 255);

  let lineSpace = map(seconds,0,88,100,15); // mapped the line space paramamter of the moire generator to decrease of the intro, matching the build up feeling as it gets closer to the body
  lineSpace = max(lineSpace,15); //setting a minimum linespace value so that it retains clarity and performance

  push();

  if (!noTranslate) { // if statment that keeps the moire layers on screen at all times, if I want a layer to be translated this is called, else its not.  double negative statement but it works.
    translate(width/2, height/2);
  }

  //moire controls
  scale(4); //making it so the moire fills the whole sketch
  rotate(angleCounter); // sets the angle that the moire patterns are being generated at
  MoireModulators(); //moire Modulator

  let maxRadius = 380;// padding margin to make sure the pattern is always fully covering the screen

  ///creating a grid of modulated lines (or rectangles) for the pattern that also always cover the whole sketch
  for (let x = -maxRadius; x < maxRadius; x += lineSpace / 2) {
    for (let y = -maxRadius; y < maxRadius; y += lineSpace) {
      waves(x, y, moireColour, layerSelect);
    }
  }

  pop();
}

function MoireModulators() { 
  //putting these paramaters into their own function so they can easily be repeated and used in different spots of the code

  angleCounter += 0.003; //rotation angle of generated pattern
  textureNoiseCounter += 0.01; // how much noise is added 
  strokeWeightNoiseCounter += 0.03; // how much noise is added
}

function loadFaceImages() {
  //function to load images, so that the draw one frame function is cleaner
  for (let x = 1; x <= faceImageAmount; x++) {   //for loop so that I don't have to call away 24+ images individually, starting at 1 instead of 0 since it is being used to call the name of the image which starts at 1.png
    faceFrames.push(loadImage("face/" + x + ".png"));  //loading images from folder named face to keep side bar clean with so many images
  }

  for (let x = 1; x <= faceImageAmount; x++) {   //for loop so that I don't have to call away 24+ images individually, starting at 1 instead of 0 since it is being used to call the name of the image which starts at 1.png
    pinkfaceFrames.push(loadImage("pinkface/" + x + ".jpg"));  //loading images from folder named face to keep side bar clean with so many images
  }
  // img = loadImage("Pixelsorted/1.png");
  firstRun = false;
}

function faceLayer(vocal,counter) {
  if (firstRun) { // a way to make the animation use less processing power by only loading the images once instead of every loop
    loadFaceImages(); //calling away the load image function
    if (faceFrames.length < faceImageAmount) return; // makes it so that the code won't run untill all images are loaded by checking how many have been loaded against the total frames
  }

  if (faceFrames.length > 0) { //if the faceFrames array is loaded , image the current frame
    image(faceFrames[currentImage], 0,  0, width, height); ///imaging the animation by imaging the current image from the array
  }

  // if (pinkfaceFrames.length > 0) { //if the faceFrames array is loaded , image the current frame
  //   image(pinkfaceFrames[currentImage], 0, 0, width, height); ///imaging the animation by imaging the current image from the array
  // }

  if (frameCount % 3 === 0) { //setting the framerate of the animation to 12Fps to get that stop motion look, while keeping the total sketch framerate at 60fps
    currentImage = (currentImage + 1) % faceImageAmount; // tells the loop to go to the next image
  }
}

function waves(x, y, moireColour, layerSelect) {
  //function that modulates the lines in the moire function so that moire is cleaner
  //using noise to modulate a line

  let noiseX = textureNoiseCounter + x / waveScale;
  let noiseY = textureNoiseCounter + y / waveScale;

  let offset = map(noise(noiseX, noiseY), 0, 1, -wavesOffamount, wavesOffamount);
  let field = map(noise(x, y), 0, 1, noiseMap1, noiseMap2);

  strokeWeight(1);
  if (field < offset) offset = field;

  // Draw lines or rectangles based on wavesShape
  if (wavesShape === "line") {
    // Only drawing lines
    stroke(moireColour);
    noFill();
    line(x + offset, y + offset, x + offset * 2, y + offset * 2);
  } else if (wavesShape === "rect") {
    // Drawing rectangles for moire
    stroke(0);
    if (layerSelect === "blue") {
      fill(0,0,255);
    } else {
      fill(255,25,104);
    }
    let w = offset * 2;
    let h = offset * 2;
    
    rectMode(CENTER);
    rect(x + offset, y + offset, w, h);
  }
}

// function rasterisation() {
//   let pixelW = width / gridsX;
//   let pixelH = height / gridsY;
//   let moirePg = pg.get();

//   noStroke();

//   for (let x = 0; x < gridsX; x++) {
//     for (let y = 0; y < gridsY; y++) {
//       let px = int(x * pixelW)+ pixelW/4;
//       let py = int(y * pixelH)+ pixelH/4;

//       let clr = moirePg.get(px, py);
//       let bright = brightness(clr);
//       let size = map(bright, 0, 255, 0, 1);

//       let maskW = pixelW * size;
//       let maskH = pixelH * size;

//       push();
//       fill(clr);
//       translate(px, py);
//       rect(0, 0, maskW, maskH);
//       pop();
//     }
//   }
// }

// noise generator
//   let tileW = width / tilesX;
//   let tileH = height / tilesY;

//   for (let x = 0; x < tilesX; x++) {
//     for (let y = 0; y < tilesY; y++) {
//       fill(random(0,40),60);
//       noStroke();
//       rect(x * tileW, y * tileH, tileW, tileH);
//     }
// //   }
// // }
// // }