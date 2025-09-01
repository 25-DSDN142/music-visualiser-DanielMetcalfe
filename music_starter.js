let firstRun = true; //image preload

let bgimg;

//animated face paramaters
let faceFrames = {}; // object to lazily hold loaded images by frame number (not a packed array)
let faceImageAmount = 1280; //total images in array
let currentImage = 0; // current image in foreloop
let img;

let lineAmountX= 200; //amount of lines
let lineAmountY= 200;
// let lineSpace = 15; //20 for body, 40 for inro
let textureNoiseCounter = 2;
let strokeWeightNoiseCounter = 2;
let angleCounter = 20;
let noiseMap1 = -5;
let noiseMap2 = 100;
let waveScale = 200;
let wavesOffamount =40;
//400,40

// moire layer controls
let wavesShape = "line"; //setting it up for the option to add rectangles or ellipses etc
let moireLayers = 1;     // how many layers of moire, to give different variations during song
let moireVisible = true; // a paramater to turn on and off the moire layers to get pauses that match drum pauses in the song etc.

let blueMoireLayerCenter; // a paramater to make sure the blue layer is always on screen

//rasterisation variables , not sure if I will use but keeping for now
let gridsX = 20;
let gridsY=gridsX;

let pink, blue, pg;

// buffer config
let FACE_CLIP_START = 259;
let FACE_CLIP_END = 698;
let FACE_CLIP_FPS = 12;
let FACE_CLIP_SECONDS_START = 21.36;
let FACE_CLIP_SECONDS_END = 46.26;
let FACE_CLIP_LEN = FACE_CLIP_END - FACE_CLIP_START + 1;
let FACE_BUFFER_AHEAD = 10;

function drawFaceClipSynced(seconds) {
  let framePeriod = 1.0 / FACE_CLIP_FPS;
  let clipElapsed = seconds - FACE_CLIP_SECONDS_START;
  if (clipElapsed < 0) clipElapsed = 0;
  let localFrame = Math.floor(clipElapsed * FACE_CLIP_FPS);
  if (localFrame < 0) localFrame = 0;
  if (localFrame >= FACE_CLIP_LEN) localFrame = FACE_CLIP_LEN - 1;
  let imageIdx = FACE_CLIP_START + localFrame;

  for (let i = 0; i < FACE_BUFFER_AHEAD && imageIdx+i <= FACE_CLIP_END; i++) {
    let idx = imageIdx + i;
    if (!faceFrames[idx]) {
      faceFrames[idx] = loadImage("face/" + idx + ".jpg");
    }
  }
  let img = faceFrames[imageIdx];
  if (img && img.width > 0) {
    image(img, 0, 0, width, height);
  }
}

function draw_one_frame(words, vocal, drum, bass, other, counter) {
  if (!bgimg) {
    bgimg = loadImage("face/bgimage.jpg");
    background(0,0,255);
  } else if (bgimg.width > 0) {
    image(bgimg, 0, 0, width, height);
  } else {
    background(0,0,255);
  }
  angleMode(DEGREES);

  let seconds = counter/60;

  // if statements that control whether a moire layer is visible, what shape it is and how many moire layers
  //based on seconds which is controlled by the counter variable/60

  //lines
  if (seconds < 11) { //intro
    wavesShape = "line";
    moireLayers = 1;
    moireVisible = true;
  }
  if (seconds >= 11 && seconds < 12) { //double moire layer at 11s
    wavesShape = "line";
    moireLayers = 2;
    moireVisible = true;
  }
  if (seconds >= 12 && seconds < 87) { //rest of intro/body leadup
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

  blueMoireLayerCenter = (counter * 0.1) % 360;

  if (counter > 0) { //making it so that the animation only happens when the song is playing

    let pink = color(255, 25, 104); //colours used
    let blue = color(0,0,255);
    let grey = color(120);

    // Only play facelayer inside clip times
    if(seconds >= FACE_CLIP_SECONDS_START && seconds < FACE_CLIP_SECONDS_END){
      drawFaceClipSynced(seconds);
    }

    blendMode(BURN); // this sets the overlay below to blend with the face layer in a high contrast way

    let vocalBlend= map(vocal,40,60,0,1);
    let faceColour = lerpColor(grey,blue,vocalBlend);

    //colour overlay to get that glitchy desaturated effect
    fill(faceColour,50); 
    noStroke();
    rect(0, 0, width, height);

    blendMode(BLEND);

    if (moireVisible) {
      if (moireLayers === 1) {
        push();
        Moire(seconds, pink, 'pink', counter);
        pop();
      } 
      else if (moireLayers === 2) {
        push();
        Moire(seconds, pink, 'pink', counter);
        pop();

        push();
        Moire(seconds, blue, 'blue', counter);
        pop();
      }
    } 
    else {
      MoireModulators();
      if (moireLayers === 2) {
        MoireModulators();
        MoireModulators();
      } 
      else {
        MoireModulators();
      }
    }

    let tilesX= 1920/8;
    let tilesY=1080/8;
    let tileW = width / tilesX;
    let tileH = height / tilesY;

    for (let x = 0; x < tilesX; x++) { 
      for (let y = 0; y < tilesY; y++) {
        fill(40,90);
        ellipse(x * tileW, y * tileH, tileW, tileH);
      }
    }
  }
}

function Moire(seconds, moireColour, layerSelect, counter) {
  pink = color(237, 25, 104); 
  blue = color(0, 0, 255);

  let lineSpace = map(seconds,0,88,100,15);
  lineSpace = max(lineSpace,15);

  push();

  translate(width/2, height/2);

  scale(4);
  if (layerSelect === "blue" && moireLayers === 2) {
    rotate(counter * 0.1);
  } else {
    rotate(angleCounter);
  }
  MoireModulators();

  let maxRadius = 380;

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
  for (let x = 1; x <= faceImageAmount; x++) {
    faceFrames[x] = loadImage("face/" + x + ".jpg");
  }
firstRun = false;
}

function faceLayer(vocal,counter) {
  if (firstRun) {
    loadFaceImages();
    let numLoaded = Object.keys(faceFrames).length;
    if (numLoaded < faceImageAmount) return;
  }
  let frameIdx = (currentImage+1);
  if (faceFrames[frameIdx] && faceFrames[frameIdx].width > 0) {
    image(faceFrames[frameIdx], 0, 0, width, height);
  }
  if (frameCount % 3 === 0) {
    currentImage = (currentImage + 1) % faceImageAmount;
  }
}

function waves(x, y, moireColour, layerSelect) {
  let noiseX = textureNoiseCounter + x / waveScale;
  let noiseY = textureNoiseCounter + y / waveScale;

  let offset = map(noise(noiseX, noiseY), 0, 1, -wavesOffamount, wavesOffamount);
  let field = map(noise(x, y), 0, 1, noiseMap1, noiseMap2);

  strokeWeight(1);
  if (field < offset) offset = field;

  if (wavesShape === "line") {
    stroke(moireColour);
    noFill();
    line(x + offset, y + offset, x + offset * 2, y + offset * 2);
  } else if (wavesShape === "rect") {
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