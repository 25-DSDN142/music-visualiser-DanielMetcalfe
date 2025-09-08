let firstRun = true;
let bgimg;
let faceFrames = {};
let faceImageAmount = 3705;
let currentImage = 0;

// Images in memory paramaters
let allfaceSectionsComplete = false;
let lastAnimationEndTime = 308.042;
let maxImagesInMemory = 50;
let ImageLoadAmount = 5;
let cleanupCounter = 0;

// vocal face layer timing paramaters

let faceSections = [
  
  //cleaned up at the suggestion of my mother in law who works as a software tester. 
  //using an array to display the objects so that the paramaters can be layed out horizontally, rather than vertically, making it more legible.
 
  // Intro sections, this controls all the vocal animation in the intro section, it has a frame beginning and a frame end and then loads and images all the images in between those two frames from a start point to an end point.

  {name: 'intro1', frameBeg: 259, frameEnd: 558, start: 21.36, end: 46.26},
  {name: 'intro2', frameBeg: 650, frameEnd: 698, start: 54.15, end: 58.09},
  {name: 'intro3', frameBeg: 796, frameEnd: 823, start: 66.0, end: 68.03},
  {name: 'intro4', frameBeg: 855, frameEnd: 878, start: 71.009, end: 73.007},
  {name: 'intro5', frameBeg: 929, frameEnd: 957, start: 77.019, end: 79.041},
  {name: 'intro6', frameBeg: 1044, frameEnd: 1060, start: 86.053, end: 88.017},
  
  // Body sections, timing for body
  {name: 'body1', frameBeg: 1184, frameEnd: 1206, start: 98.034, end: 100.028},
  {name: 'body2', frameBeg: 1233, frameEnd: 1256, start: 102.039, end: 104.037},
  {name: 'body3', frameBeg: 1309, frameEnd: 1325, start: 109.000, end: 110.024},
  {name: 'body4', frameBeg: 1378, frameEnd: 1473, start: 114.041, end: 122.042},
  {name: 'body5', frameBeg: 1533, frameEnd: 1546, start: 127.040, end: 128.049},
  {name: 'body6', frameBeg: 1571, frameEnd: 1587, start: 130.047, end: 132.011},
  {name: 'body7', frameBeg: 1715, frameEnd: 1737, start: 142.047, end: 144.041},
  {name: 'body8', frameBeg: 1764, frameEnd: 1786, start: 146.052, end: 148.050},
  {name: 'body9', frameBeg: 1814, frameEnd: 1856, start: 153.012, end: 154.036},
  {name: 'body10', frameBeg: 2772, frameEnd: 2794, start: 230.054, end: 232.048},
  {name: 'body11', frameBeg: 2821, frameEnd: 2844, start: 234.059, end: 236.057},
  {name: 'body12', frameBeg: 2897, frameEnd: 2913, start: 241.019, end: 242.043},
  {name: 'body13', frameBeg: 3303, frameEnd: 3324, start: 275.006, end: 277.000},
  {name: 'body14', frameBeg: 3352, frameEnd: 3374, start: 279.011, end: 281.009},
  {name: 'body15', frameBeg: 3428, frameEnd: 3444, start: 285.032, end: 286.056},
  {name: 'body16', frameBeg: 3501, frameEnd: 3596, start: 291.037, end: 299.038},
  {name: 'body17', frameBeg: 3652, frameEnd: 3664, start: 304.011, end: 305.020},
  {name: 'body18', frameBeg: 3689, frameEnd: 3705, start: 307.018, end: 308.042},
  
  // Breakdown sections, timing for breakdown
  {name: 'breakdown1', frameBeg: 2112, frameEnd: 2406, start: 175.055, end: 200.028},
  {name: 'breakdown2', frameBeg: 2629, frameEnd: 2645, start: 218.057, end: 220.021},
  {name: 'breakdown3', frameBeg: 2699, frameEnd: 2712, start: 224.049, end: 225.058}
];

// Calculate total frames for each animation, this makes it easier to know what frame to load later and make sure it is always ahead
for (let x = 0; x < faceSections.length; x++) {
  // basically saying loop through all of the array of objects above untill you've reach all objects in the array and get the length of each animation
  //this way I don't have to hardcode it manually for each intro vocal, body vocal etc. 
  faceSections[x].totalFrames = faceSections[x].frameEnd - faceSections[x].frameBeg + 1; //total frames = end frame - beginning frame, with the +1 as a buffer to always be on time
}

//pattern parameters

let lineAmountX = 200;
let lineAmountY = 200;
let textureNoiseCounter = 2;
let strokeWeightNoiseCounter = 2;
let angleCounter = 20;
let noiseMap1 = -5;
let noiseMap2 = 100;
let waveScale = 200;
let wavesOffamount = 40;

let wavesShape = "line";
let moireLayers = 1;
let moireVisible = true;

let blueMoireLayerCenter;

let gridsX = 20;
let gridsY = gridsX;

let pink, blue, pg;

function vocalFaceLayer(seconds, vocal) {
  // Load background
  if (!bgimg) { //if the background image has not been loaded, do so. if not don't. A way of only loading the image once in the loop to save processing
    bgimg = loadImage("face/bgimage.jpg"); //loading image from the folder
  }
 
  if (bgimg && bgimg.width > 0) { //using the width of the loaded image to signal the imaging, could have used anything but figured that width would indicate that the image had actually been loaded since the width would be 0 if not
    image(bgimg, 0, 0, width, height); //imaging it
  } 
  // else {
  //   background(0, 0, 255); // background colour if the image is not loaded,is there as failsafe if the image is not loaded
  // }
  
  
//loading and ending each section of the animated vocal face layer

 if (seconds > lastAnimationEndTime + 1.0) {// if all the animated vocal sections have passed in the song, wipe all the images from memory. I was having issues with it crashing after the end of all the sections due to how many images were loaded in memory by that point. This fixes that.
  
  if (!allfaceSectionsComplete) {// way of making it only happen once at the end when all sections have occured to avoid it doing it ahead of that and not displaying the animation frames when needed
    allfaceSectionsComplete = true; // indicates to do the clearing below
    faceFrames = {}; // Clear all the images in the memory by setting the faceframes object to empty
  }
  return; //tells the code to no longer use the face animation function anymore to save even more processing power
}


let activeImages = [];//an array for what images are currently being loaded and displayed
let keepImages = []; // an array for what images to hold in memory


for (let anim of faceSections) { // a more flexible and efficient way of timing the sections, instead of having to do if statments for all 27 sections of the vocal animation. Mother in law(software tester) showed me this approach.
  
  if (seconds >= anim.start && seconds < anim.end + 0.5) {// Check if animation section is active
    
    let clipTime = max(0, seconds - anim.start); //how long the section is
    let frame, alpha;
    
    if (seconds < anim.end) {// if the time is less than the end of the animation play it
     
      frame = min(floor(clipTime * 12), anim.totalFrames - 1); // this chooses the frame to display and sets it so that the animation never plays beyond its end point, using minium function it will always take the smaller frame number. the 12 is because the animation is at 12fps to give a glitchy feel,but I didn't want to change the whole sketches fps from 60 to retain fluidity in the patterns.
      alpha = 255;// setting the opacity of the animation to 100 percent, this is because I used alpha to fade it out at the end
    } 
    
    else { //if the time reachs the end of the animations section then fade it out
     
      // Fade out of animation sections to make more smooth and match the atmospheric feel of the reverbed vocals
      frame = anim.totalFrames - 1; //finding the last frame to then start the fade
      let fadeProgress = (seconds - anim.end) / 0.5; //0.5 second fade using the end of the animated sections frame and the current time, divided by 0.5 seconds
      alpha = 255 * max(0, 1.0 - fadeProgress); //fading by reducing the alpha over 0.5 seconds
    }
    
    let imgNum = anim.frameBeg + frame; //sets the active frame number, eg. if 4 frames have passed since the beginning frame, it is now frame 5
    //this imgNum is used to preload the frames in sections so that the animation is always on time but doesn't lag
   
    activeImages.push({ // add these values into the object being displayed by the array currently
      img: imgNum,//what image is currently being displayed
      alpha: alpha, //alpha value for the fade
      maxFrame: anim.frameEnd // setting the end of the animation
    });
    
    // chooses what frames to load ahead of time using above info
    for (let x = 0; x < ImageLoadAmount && imgNum + x <= anim.frameEnd; x++) {
      let frameToKeep = imgNum + x;
      // Only add if not already in array (prevent duplicates)
      if (!keepImages.includes(frameToKeep)) {
        keepImages.push(frameToKeep); // telling it to keep the frame in memory
      }
    }
  }
}

//removal of images from memory after they are used to avoid crashing. 
// Mother in law (software tester) helped me with this, it clears the images as it goes instead of letting 3900 frames build up in memory.

cleanupCounter++;//add one to clean up every frame, once it reachs 120, eg 2 seconds at 60fps. clear the image memory

if (cleanupCounter >= 120 || Object.keys(faceFrames).length > maxImagesInMemory) {// run the image clearance form memory if the framecount reachs 120 or the frames are over the max amount allowed in memory
 
  for (let key in faceFrames) { // Remove frames from the memory once they have played
    let frameNumber = int(key); //making it so that the frame number is always a whole number to avoid issues since there are only whole numbers of images, not fractions.
  
    if (keepImages.indexOf(frameNumber) === -1) {  // Check if this image is in the keepImages array to avoid accidentally deleteing before it is needed
      delete faceFrames[key]; // delete this amount of frames
    }
  }
  cleanupCounter = 0; //reset the cleanup counter back to 0 to start over again after wiping images from memory
  
  keepImages = []; // Clear the keepImages array for next section of image loading by setting it to an empty array
}


// Loading the images

for (let {img, alpha, maxFrame} of activeImages) { //preloading the images ahead of time, once again using the more automatic way my mother in law (software tester) showed me to save hardcoding.

  for (let i = 0; i < ImageLoadAmount && img + i <= maxFrame; i++) { //using a for loop to load the images in an automatic way in sections. Would have had to hardcode in 3900 frames which would have been hard to troubleshoot.
    let frameNum = img + i; // changes the frame to load by adding the i amount up to the max frame amount to load all the images in automatic way
    if (!faceFrames[frameNum]) {// if the frame has not been loaded, do load it. way to only load it once.
      faceFrames[frameNum] = loadImage("face/" + frameNum + ".webp");// swapped from jpg to webp for performance, can have images that are less than 50kb with webp which is not possible with jpg.
    }
  }

  //displaying the images
  let faceImg = faceFrames[img]; // 
  if (faceImg && faceImg.width > 0) {// using image width again to display the image, just using the width to check the image actually has been loaded and is ready to image
    tint(255, alpha); //this is what controls the fade at the end of each section
    image(faceImg, 0, 0, width, height); //imaging
    noTint(); //returning to normal alpha again so that the next section plays at full opacity before fading
  }
}
  
  // glitchy desaturation effect on the vocal face layer

  let vocalBlend = map(vocal, 40, 60, 0, 1); //mapping the volume of the vocal to responsively blend between blue and grey giving a glichy desaturation effect
  let faceColour = lerpColor(color(120), color(0, 0, 255), vocalBlend); //using lerp colour to create he glitch effect
  
  blendMode(BURN);// applys a linear burn blend mode over the face layer to get a responsive glitchy layer with the above map and lerp color
  fill(faceColour, 50); //50 percent alpha to make the face layer more visible
  noStroke();
  rect(0, 0, width, height);
  blendMode(BLEND);// restoring the blend mode back to normal so rest of sketch is displayed normally
}

function draw_one_frame(words, vocal, drum, bass, other, counter) {
  
  angleMode(DEGREES); //changing from radians

  let seconds = counter/60; // setting up a variable to make it easier to work with counter

  if (counter > 0) { // making it so the face layer only plays when the song is playing
    vocalFaceLayer(seconds, vocal); 
  }

  // if statements that control whether a moire layer is visible, what shape it is and how many moire layers
  // based on seconds which is controlled by the counter variable/60

  //lines
  if (seconds >= 0 && seconds < 87) { //intro pattern, 1 layer of line patterns that grow in intensity over time to body 1
    wavesShape = "line";
    moireLayers = 1;
    moireVisible = true;
  }
  if (seconds >= 86 && seconds < 88) {  //pause before body 1, synced to what is happening in the song
    moireVisible = false;
  }
  if (seconds >= 88 && seconds < 109.5) { //body 1, 1 layer of line patterns
    wavesShape = "line";
    moireLayers = 1;
    moireVisible = true;
  }
  if (seconds >= 109.5 && seconds < 110) { //pause before body 2, synced to music/drums
    moireVisible = false;
  }
  if (seconds >= 110 && seconds < 132) {//body 2, two layers of line patterns
    wavesShape = "line";
    moireLayers = 2;
    moireVisible = true;
  }
  if (seconds >= 132 && seconds < 135) {  //pause before body 3, synced to the music/drums
    moireVisible = false;
  }

  //rectangles
  if (seconds >= 135 && seconds < 155.5) { // body 3, 1 layer of rectangle patterns
    wavesShape = "rect"; // setting the pattern carrier object to rectangles to create variation, this allowed me to create visually different variations from one block of code, saving performance
    moireLayers = 1;//how many layers of rectangle patterns should be playing
    moireVisible = true;
  }

  if (seconds >= 155.5 && seconds < 157) { //pause before body 4, synced to the music/drums
    moireVisible = false;
  }
 
  if (seconds >= 157 && seconds < 331) {//4th body, 2 layers of rectangles
    wavesShape = "rect";   
    moireLayers = 2; //two rectangular layers of patterns
    moireVisible = true;
  }

  if (counter > 0) { // saying to only run if the song is playing
    
    let pink = color(255, 25, 104); //pattern colours
    let blue = color(0,0,255);

    if (moireVisible) { // this is what plays if the pattern is not paused
      if (moireLayers === 1) { // play this if there if the parameter moire layers = 1.
        push();
        Moire(seconds, pink, 'pink', counter); //one layer of moire patterns that are pink
        pop();
      } 
      else if (moireLayers === 2) {// this is saying add the blue moire pattern ontop of the pink layer if moire layers is set to 2
        push();
        Moire(seconds, pink, 'pink', counter); // original pink moire layer named pink
        pop();

        push();
        Moire(seconds, blue, 'blue', counter); //additional blue layer in sections 2 moire layers are called
        pop();
      }
    } 
    
    else { // this is to keep the moire pattern going even when not visible on the sketch for the pause sections. This means that there is no weird timing issues or it starting over from the beginning everytime
      
      MoireModulators(); // seperate function to make the code more legible when it is repeated three times below
      //this makes sure the pattern still continues when not visible
      if (moireLayers === 2) { // if statement for if there are two moire layers playing in the sketch. means both layers will continue playing behind the scenes
        MoireModulators(); //since there are two layers, the modulators needs to be called twice.
        MoireModulators();
      } 
      else { //if there is just one layer, call it just once. 
        MoireModulators();
      }
    }

   //led screen effect,applied over the whole sketch for cohesivity
   // decided to do it this way as it was less perfomance heavy than the rasterisation method from my previous assignment and achieved the same result
   
   let tilesX = 160; //how many ellipses on the x axis of the grid
    let tilesY = 90;  //how many on the y axis
    let tileW = width / tilesX; // variables to make the code cleaner below, essentially dividing the sketch by the amount ellipses on the x and y axis to evenly distribute them and responsively control the size of them
    let tileH = height / tilesY;

    for (let x = 0; x < tilesX; x++) { //nested for loop to create the grid of ellipses
      for (let y = 0; y < tilesY; y++) {
        fill(40,90);//alpha at 90 to make the image brighter through the grid
        ellipse(x * tileW, y * tileH, tileW, tileH);
      }
    }
  }
}

function Moire(seconds, moireColour, layerSelect, counter) {
  //function that generates how the patterns will act, eg if they will rotate etc
  pink = color(237, 25, 104); //pattern colours
  blue = color(0, 0, 255);

  let lineSpace = map(seconds,0,88,100,15);// how the speed and spacing of the pattern is mapped to the pace of the song and build up in the intro. it starts of sparse and slower and then increases in intensity as it gets to the body of the song
  lineSpace = max(lineSpace,15); //setting a limit of how close together the lines of the pattern can get, for both legibility and performance

  push();//own system for translating and rotating around itself

  translate(width/2, height/2);//centering the pattern 

  scale(4);// scaling it make it cover the whole sketch so there were no weird gaps
  
  if (layerSelect === "blue" && moireLayers === 2) {// adding in rotatation to the blue layer to give more dynamism to the scene
    rotate(counter * 0.1); // using counter to control the rotation
  } else {
    rotate(angleCounter); // essentially no rotation if just one layer.
  }
  MoireModulators(); // function that has the noise modulators in it to keep the code cleaner. 

  let maxRadius = 380; // sets the total amount of lines and the distane it is , basically the maximum distance a line can be placed

  for (let x = -maxRadius; x < maxRadius; x += lineSpace / 2) { //nested for loop that turns it from one line to 380 lines, creating the pattern 
    for (let y = -maxRadius; y < maxRadius; y += lineSpace) {
      waves(x, y, moireColour, layerSelect);// the line, or shape carrier that is being pushed out into the pattern
    }
  }

  pop();
}

function MoireModulators() { 
  //modulators that influence how much the noise impact the pattern generation
  //put into its own function for cleaner code, since it is called away multiple times for different layers and timing
  
  angleCounter += 0.003; //this sets the angle/axis that the pattern is generated at
  textureNoiseCounter += 0.01; // how much noise is added, adjusting this increases the amount of noise impact on the pattern
  strokeWeightNoiseCounter += 0.03; //an additional variable to add greater variation in noise
}

function waves(x, y, moireColour) {
//function to clean up the moire function code
//this is the thing that is creating the waves/patterns, it is using noise to modulate the x and y positions and size of the particle shape, eg line or rect.
  
let noiseX = textureNoiseCounter + x / waveScale; // how much the noise modulators effect the x axis
  let noiseY = textureNoiseCounter + y / waveScale; //how much they effect the y axis

  let offset = map(noise(noiseX, noiseY), 0, 1, -wavesOffamount, wavesOffamount);//using map to control the amount the noise can offset the patterns to a legible range. if this is not done, it just becomes a too random if at small numbers, and it is not visible at large numbers. This range makes it visible at all times
  let field = map(noise(x, y), 0, 1, noiseMap1, noiseMap2); // an additional map, to control the distance of the noise again

  strokeWeight(1);// setting the line weight
  
  if (field < offset) offset = field; // setting the offset to switch to the second modulator if it goes below the field amount, this just adds more variation and modulation

  if (wavesShape === "line") { //if 
    stroke(moireColour);// moire Colour allows one line of code to select between pink or blue instead of having to do if statements
    noFill();
    line(x + offset, y + offset, x + offset * 2, y + offset * 2);// offsetting the line coordinates using the offse, which is controlled by the noise, this creates the pattern 
  } 
  
  else if (wavesShape === "rect") { //if the waveshape seletor is rectangles do this
     
    stroke(0); //black stroke to make the squares visible when close together or overlayed
    fill(moireColour); // Use moireColour as way to s
      
      rectMode(CENTER);
    rect(x + offset, y + offset, offset * 2, offset * 2);//offset is the noise modualation, controlling the position and size of the object to create the pattern
  }
}
