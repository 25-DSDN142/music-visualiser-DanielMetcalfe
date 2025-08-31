let firstRun = true; //image preload

//animated face paramaters
let faceFrames = [];       //setting up animation using array of images
let pinkfaceFrames = [];       //setting up animation using array of images
let faceImageAmount = 24; //total images in array
let currentImage = 0; // current image in foreloop
let img;


//moire
let lineAmountX= 200;
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

//rasterisation variables
let gridsX = 20;
let gridsY =gridsX;

let pink, blue, pg;

function draw_one_frame(words, vocal, drum, bass, other, counter) {
  background(70,122,255);
angleMode(DEGREES);

  if (counter > 0) { //making it so that the animation only happens when the song is playing



    let pink = color(255, 25, 104);
    let blue= color(0,0,255);
    let grey= color(120);


    
let seconds = counter/60;

    faceLayer();
    
 if (seconds > 21.26) {
  
   noFill();
   noStroke();
   rect(0,0,width,height);
    }

    else {
      fill(0,122,255);
      rect(0,0,width,height);

    }
    
    blendMode(BURN);
   
let vocalBlend= map(vocal,40,60,0,1);
   let faceColour = lerpColor(grey,blue,vocalBlend);

  // let bassMoireBlend = map(bass,0,60,0,1);
  // let moire1Colour = lerpColor(blue,pink,bassMoireBlend);

    fill(faceColour,100);
    noStroke();
    rect(0, 0, width, height);
  
   
    blendMode(BLEND);
    
    
    
    
    
    
   
push();
// rotate(counter*0.1);
Moire(seconds,pink);
pop();

if (seconds >110){
push();
rotate(counter*0.1);
Moire(seconds,blue);
pop();
}
let tilesX= 1920/8; //setting the ledscreen dots
let tilesY=1080/8;
let tileW = width / tilesX;
let tileH = height / tilesY;

 for (let x = 0; x < tilesX; x++) {
   for (let y = 0; y < tilesY; y++) {
   fill(40,90); //reducing the opacity a little bit to retain the face better and make it look like it is on a screen
    
   ellipse(x * tileW, y * tileH, tileW, tileH);
   }
 }
 
// push();
// stroke(pink);
// rotate(20);
// Moire();
// pop();

  }
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
      image(faceFrames[currentImage], 0, 0, width, height); ///imaging the animation by imaging the current image from the array
    }

    // if (pinkfaceFrames.length > 0) { //if the faceFrames array is loaded , image the current frame
    //   image(pinkfaceFrames[currentImage], 0, 0, width, height); ///imaging the animation by imaging the current image from the array
    // }

    if (frameCount % 3 === 0) { //setting the framerate of the animation to 12Fps to get that stop motion look, while keeping the total sketch framerate at 60fps
      currentImage = (currentImage + 1) % faceImageAmount; // tells the loop to go to the next image
    }

   //adding a led screen like effect so it matches rest of animation layers that will be created in p5
   //doing it in a more processor friendly way of just overlaying a grid of ellipses on top of the animation
   
  // let tilesX= 1920/8; //setting the ledscreen dots
  //  let tilesY=1080/8;
  //  let tileW = width / tilesX;
  //  let tileH = height / tilesY;

  //   for (let x = 0; x < tilesX; x++) {
  //     for (let y = 0; y < tilesY; y++) {
  //     fill(40,90); //reducing the opacity a little bit to retain the face better and make it look like it is on a screen
       
  //     ellipse(x * tileW, y * tileH, tileW, tileH);
  //     }
  //   }
  }
  



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

// }
// }



function Moire(seconds,moireColour) {
  //background pattern as pGraphics so it can be rasterised later
  pink = color(237, 25, 104); ///intro alpha at 90?
  blue = color(0, 0, 255);
  let lineSpace = map(seconds,0,88,100,15);
  lineSpace = max (lineSpace,15);
  push();
  // background(pink);
  stroke(moireColour);
  translate(width *2/3, height / 2);
  scale(4);
  rotate(angleCounter);

  //noise modulators to create moire patterns
  angleCounter += 0.003;
  textureNoiseCounter += 0.01;
  strokeWeightNoiseCounter += 0.03;

  ///creating a grid of modulated lines
  for (let x = -width / 2; x < lineAmountX; x += lineSpace / 2) {
    for (let y = -height / 2; y < lineAmountY; y += lineSpace) {
      waves(x, y);
    }
  }

  pop();
}

function waves(x, y) {
//function that modulates the lines in the moire function so that moire is cleaner
  //using noise to modulate a line

  let noiseX = textureNoiseCounter + x / waveScale;
  let noiseY = textureNoiseCounter + y / waveScale;

  let offset = map(noise(noiseX, noiseY), 0, 1, -wavesOffamount, wavesOffamount);
  let field = map(noise(x, y), 0, 1, noiseMap1, noiseMap2);

  strokeWeight(1);
  if (field < offset) offset = field;

  line(x + offset, y + offset, x + offset * 2, y + offset * 2);
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