
//image loading settings/paramaters
let bgimg;//bg image
let faceFrames = {}; //object that stores the loaded in images for the face layer animation
let faceImageAmount = 3705; //totals frames for all the face animations
let currentImage = 0; //setting the current image of the animation to 0 so it always starts at beginning

// Images in memory/wiping them paramaters
let allfaceSectionsComplete = false; //setting up the true/false variable to only wipe completely when all animations have played
let lastAnimationEndTime = 308.042; //the end time of the last animated face section, in seconds.
let maxImagesInMemory = 50; //setting the maximum amount of frames that can be stored in the memory at once
let ImageLoadAmount = 5; //how many images to preload at once, 5 gave the best balance of performance and consistancy of loading on time
let cleanupCounter = 0; //setting up a parameter that is used to count the frames before wiping animation frames from memory


// vocal face layer timing paramaters

let faceSections = [ 
  
  //cleaned up at the suggestion of my mother in law who works as a software tester. 
  //using an array to display the objects so that the paramaters can be layed out horizontally, rather than vertically, making it more legible and turning approx 100 lines into just 27 lines of code.
 
  // Intro sections, this controls all the vocal animation in the intro section, it has a frame beginning and a frame end and then loads and images all the images in between those two frames from a start point to an end point.

  {name: 'intro1', frameBeg: 259, frameEnd: 558, start: 21.36, end: 46.26}, //frameBeg=startframe, frameEnd= end frame, start and end = beginning and end in seconds 
  {name: 'intro2', frameBeg: 650, frameEnd: 698, start: 54.15, end: 58.09},
  {name: 'intro3', frameBeg: 796, frameEnd: 823, start: 66.0, end: 68.03},
  {name: 'intro4', frameBeg: 855, frameEnd: 878, start: 71.009, end: 73.007},
  {name: 'intro5', frameBeg: 929, frameEnd: 957, start: 77.019, end: 79.041},
  {name: 'intro6', frameBeg: 1044, frameEnd: 1060, start: 86.053, end: 88.017},
  
  // Body sections, timing for body
  {name: 'body1', frameBeg: 1184, frameEnd: 1206, start: 98.034, end: 100.028},
  
  {name: 'intro1', frameBeg: 259, frameEnd: 558, start: 21.36, end: 46.26},
  {name: 'intro2', frameBeg: 650, frameEnd: 698, start: 54.15, end: 58.09},
  {name: 'intro3', frameBeg: 796, frameEnd: 823, start: 66.0, end: 68.03},
  {name: 'intro4', frameBeg: 855, frameEnd: 878, start: 71.009, end: 73.007},
  {name: 'intro5', frameBeg: 929, frameEnd: 957, start: 77.019, end: 79.041},
  {name: 'intro6', frameBeg: 1044, frameEnd: 1071, start: 86.053, end: 88.017},
 
  //body secton vocal timing
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
  {name: 'breakdown1', frameBeg: 2112, frameEnd: 2406, start: 175.55, end: 200.028},
  {name: 'breakdown2', frameBeg: 2629, frameEnd: 2645, start: 218.057, end: 220.021},
  {name: 'breakdown3', frameBeg: 2699, frameEnd: 2712, start: 224.049, end: 225.058}
];

// Calculate total frames for each animation, this makes it easier to know what frame to load later and make sure it is always ahead,placed in global since don't have a setup
for (let x = 0; x < faceSections.length; x++) {
  // basically saying loop through all of the array of objects above untill you've reach all objects in the array and get the length of each animation
  //this way I don't have to hardcode it manually for each intro vocal, body vocal etc. 
  faceSections[x].totalFrames = faceSections[x].frameEnd - faceSections[x].frameBeg + 1; //total frames = end frame - beginning frame, with the +1 as a buffer to always be on time
}


//pattern parameters

let textureNoiseCounter = 2;// parameter that impacts how much noise modulates the pattern
let angleCounter = 20; //the angle that the noise creates the pattern at
let noiseMap1 = -5; //controls the shape of the pattern, it essentailly adjusts how random the pattern is, some close numbers to each other give less random results, further numbers give more random noise results
let noiseMap2 = 100;
let waveScale = 200; //how much the noise effects the x and y xis
let wavesOffamount = 40; //how much the x,y and size paramaters are modulated by the noise

let wavesShape = "line";// setting up oggle paramater to switch between carrier shapes for the pattern, lines, rectangles, ellipses
let patternLayers = 1; //the amount of layers of patterns in different sections, 1 or 2
let patternVisible = true; //whether the pattern is visible, for when I pause the pattern to match sections in the song
let pink, blue;// pattern Colours



function draw_one_frame(words, vocal, drum, bass, other, counter) {
  //where everything is drawn
  
 angleMode(DEGREES); //changing from radians
 let seconds = counter/60; // setting up a variable to make it easier to work with counter

  if (counter > 0) { // making it so the layers only play when the song is playing
    
    vocalFaceLayer(seconds, vocal); //displaying the face animations that are tied to the vocal timing
  
    patternTimeBasedControls(seconds, counter, drum, bass, other); //timebased controls for the pattern
  
    lEDoverlay();  //  //led screen effect,applied over the whole sketch for cohesivity

  }
}
function vocalFaceLayer(seconds, vocal) {
//function for the animated face layer that is tied to the vocal

  // Load background image
  if (!bgimg) { //if the background image has not been loaded, do so. if not don't. A way of only loading the image once in the loop to save processing and not load it every time it loops the drawoneframe function
    bgimg = loadImage("face/bgimage.jpg"); //loading image from the folder to make the sidebar cleaner than having thousands of images in there
  }
 
  if (bgimg && bgimg.width > 0) { //using the width of the loaded image to signal the imaging, could have used anything but figured that width would indicate that the image had actually been loaded since the width would be 0 if not
    image(bgimg, 0, 0, width, height); //imaging it
  } 
  
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
  //anim object is the object that the current active frames are stored in to be called an displayed, faceSections is the original object that was setup for all the parameters in the animated face sections
  
  if (seconds >= anim.start && seconds < anim.end + 0.5) {// Check if animation section is active, the plus 0.5 is because of the 0.5 second fade out I setup
    
    let clipTime = max(0, seconds - anim.start); //how long the section is, anim.start is the beginning of the anim object,max is making it so it can't go over this length
    let frame, alpha; //frame is setup for the current frame to be displayed, alpha is setup for the fade.
    
    if (seconds < anim.end) {// if the time is less than the end of the animation play it, anim.end is the end of that section
     
      frame = min(floor(clipTime * 12), anim.totalFrames - 1); // this chooses the frame to display and sets it so that the animation never plays beyond its end point, using minium function it will always take the smaller frame number. the 12 is because the animation is at 12fps to give a glitchy feel,but I didn't want to change the whole sketches fps from 60 to retain fluidity in the patterns.
      alpha = 255;// setting the opacity of the animation to 100 percent, this is because I used alpha to fade it out at the end
    } 
    
    else { //if the time reachs the end of the animations section then fade it out
     
      // Fade out of animation sections to make more smooth and match the atmospheric feel of the reverbed vocals
      frame = anim.totalFrames - 1; //finding the last frame to then start the fade
      let fadeProgress = (seconds - anim.end) / 0.5; //0.5 second fade using the end of the animated sections frame and the current time, divided by 0.5 seconds
      alpha = 255 * max(0, 1.0 - fadeProgress); //fading by reducing the alpha over 0.5 seconds, max is making it so it can't go longer than the current fade amount for that frame
    }
    
    let imgNum = anim.frameBeg + frame; //sets the active frame number, eg. if 4 frames have passed since the beginning frame, it is now frame 5
    //this imgNum is used to preload the frames in sections so that the animation is always on time but doesn't lag
   
    activeImages.push({ // pushs add these values  in this loop into the object being displayed by the array currently, mother in law( software tester) showed me this
      img: imgNum,//what image is currently being displayed
      alpha: alpha, //alpha value for the fade
      maxFrame: anim.frameEnd // setting the end of the animation
    });
    
    // chooses what frames to load ahead of time using above info
    for (let x = 0; x < ImageLoadAmount && imgNum + x <= anim.frameEnd; x++) { //for loop to load frames automatically
      let frameToKeep = imgNum + x;
    
      if (!keepImages.includes(frameToKeep)) {  // Only add if not already in the object, this way it is only added once instead of every draw loop
     
        keepImages.push(frameToKeep); // telling it to keep the frame in memory, keepImages is an object setup to store the images that are needed
      }
    }
  }
}

//removal of images from memory after they are used to avoid crashing. 
// Mother in law (software tester) helped me with this, it clears the images as it goes instead of letting 3900 frames build up in memory. 

cleanupCounter++;//add one to clean up every frame, once it reachs 120, eg 2 seconds at 60fps. clear the image memory

if (cleanupCounter >= 120 || Object.keys(faceFrames).length > maxImagesInMemory) { // run the image clearance from memory if the framecount reachs 120 or the frames are over the max amount allowed in memory
  
  for (let frameNo in faceFrames) { // Remove frames from the memory once they have played, renamed from 'key' to 'frameNo'
    let frameNumber = int(frameNo); //making it so that the frame number is always a whole number to avoid issues since there are only whole numbers of images, not fractions.
  
    if (keepImages.indexOf(frameNumber) === -1) {  // Check if this image is in the keepImages array to avoid accidentally deleteing before it is needed
      delete faceFrames[frameNo]; // delete this amount of frames
    }
  }
  
  cleanupCounter = 0; //reset the cleanup counter back to 0 to start over again after wiping images from memory
  keepImages = []; // Clear the keepImages array for next section of image loading by setting it to an empty array
}


// Loading the images

for (let {img, alpha, maxFrame} of activeImages) { //preloading the images ahead of time, once again using the more automatic way my mother in law (software tester) showed me to save hardcoding.

  for (let i = 0; i < ImageLoadAmount && img + i <= maxFrame; i++) { //using a for loop to load the images in an automatic way in sections. Would have had to hardcode in 1000s of frames which would have been hard to troubleshoot.
    let frameNum = img + i; // changes the frame to load by adding the i amount up to the max frame amount to load all the images in automatic way
    if (!faceFrames[frameNum]) {// if the frame has not been loaded, do load it. way to only load it once.
      faceFrames[frameNum] = loadImage("face/" + frameNum + ".webp");// swapped from jpg to webp for performance, can have images that are less than 50kb with webp which is not possible with jpg.
    }
  }

  //displaying the images
  let faceImg = faceFrames[img]; // creating a variable that can be used below in the image function but also be updated by the current frame that is loaded. basically creating a static variable that displays realtime frame changes
  if (faceImg && faceImg.width > 0) {// using image width again to display the image, just using the width to check the image actually has been loaded and is ready to image
    tint(255, alpha); //this is what controls the fade at the end of each section, using alpha to fade from 255, to 0. alpha value is tied to the time passed
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


function pattern(seconds, patternColour, layerSelect, counter,bass,drum,other) {
  //function that generates how the patterns will act, eg if they will rotate etc
 
  pink = color(237, 25, 104); //pattern colours
  blue = color(0, 0, 255);
  let lineSpace;//the distance between lines or rectangles etc.
  
  if (seconds >= 0 && seconds <= 88) { // intro pattern build up
    lineSpace = map(seconds,0,88,100,15);// how the speed and spacing of the pattern is mapped to the pace of the song and build up in the intro. it starts of sparse and slower and then increases in intensity as it gets to the body of the song
    lineSpace = max(lineSpace,15); //setting a limit of how close together the lines of the pattern can get, for both legibility and performance
  }
 
  else if (seconds >= 175 && seconds <= 223) {//breakdown build up effect
    lineSpace = map(seconds,175,223,200,15);// how the speed and spacing of the pattern is mapped to the pace of the song and build up in the intro. it starts of sparse and slower and then increases in intensity as it gets to the body of the song
    lineSpace = max(lineSpace,15); //setting a limit of how close together the lines of the pattern can get, for both legibility and performance
  }
  else if (seconds >= 223 && seconds <= 309) {//second body
    lineSpace = 15; //setting a limit of how close together the lines of the pattern can get, for both legibility and performance
  }

  
  else if (seconds >= 309 && seconds <= 331) {//end slow down effect
    lineSpace = map(seconds,309,331,15,100);// how the speed and spacing of the pattern is mapped to the pace of the song and build up in the intro. it starts of sparse and slower and then increases in intensity as it gets to the body of the song
    lineSpace = max(lineSpace,15); //setting a limit of how close together the lines of the pattern can get, for both legibility and performance
  }
 
  else {
    lineSpace = 15; // making the line space of 15 the distance for every other section,eg the body sections
  }

  push();//own system for translating and rotating around itself

  translate(width/2, height/2);//centering the pattern 
  scale(4);// scaling it make it cover the whole sketch so there were no weird gaps
  
  if (layerSelect === "blue" && patternLayers === 2) {// adding in rotatation to the blue layer to give more dynamism to the scene
    rotate(counter * 0.1); // using counter to control the rotation
  } else {
    rotate(angleCounter); // essentially no rotation if just one layer.
  }
  patternModulators(seconds, drum, bass, other); // function that has the noise modulators in it to keep the code cleaner. 

  let maxRadius = 380; // sets the total amount of lines and the distane it is , basically the maximum distance a line can be placed

  for (let x = -maxRadius; x < maxRadius; x += lineSpace / 2) { //nested for loop that turns it from one line to 380 lines, creating the pattern 
    for (let y = -maxRadius; y < maxRadius; y += lineSpace) {
      waves(x, y, patternColour, layerSelect);// the line, or shape carrier that is being pushed out into the pattern
    }
  }

  pop();
}

function patternModulators(seconds,drum,bass,other) { 
  //modulators that influence how much the noise impact the pattern generation
  //put into its own function for cleaner code, since it is called away multiple times for different layers and timing
 
if (seconds > 223) { //changing the pattern subtly for the second half of song for greater variation that remains consistant with first half
   
    noiseMap1 = 8;  //subtly changing the pattern paramaters to make the second half different to the first
    noiseMap2 = 80;

    //subtle mapping since the noise modulators are really sensitive and it can look bad really fast if the value is too high
    //main control of the pattern is tied to the bass since that is focal point of the body sections, this gives the pattern that flowy rolling feeling of the reese bass

    let drumsAmount2= map(drum,0,100,0.0001,0.001); //mapping the drums to modify the noise pattern in a subtle way so it doesn't turn it into random noise
    let bassAmount2= map(bass,0,100,0.00005,0.01); //mapping bass to noise
    let otherAmount2= map(other,0,100,0.0025,0.01);; //mapping other to noise
   
    angleCounter += -0.005 - bassAmount2; //this sets the angle/axis that the pattern is generated at
    textureNoiseCounter += 0.01 +otherAmount2+drumsAmount2; // how much noise is added, adjusting this increases the amount of noise impact on the pattern
  
  }

  else if  (seconds >= 88 && seconds < 175) { //first body
    //subtle mapping since the noise modulators are really sensitive and it can look bad really fast if the value is too high
   //main control of the pattern is tied to the bass since that is focal point of the body sections, giving the pattern the flowy rolling feeling of the reese bass
   //but the drums and other are also mapped for subtle variation
   
   let drumsAmount1= map(drum,0,100,0.000005,0.0005); //mapping the drums to modify the noise pattern in a subtle way so it doesn't turn it into random noise
    let bassAmount1= map(bass,0,100,0.00005,0.01); //mapping bass to noise
    let otherAmount1= map(other,0,100,0.0025,0.01); //mapping other to noise
    
    angleCounter += 0.003 + bassAmount1; //this sets the angle/axis that the pattern is generated at
    textureNoiseCounter += 0.01 +otherAmount1+drumsAmount1; // how much noise is added, adjusting this increases the amount of noise impact on the pattern
 }

 else { //intro and breakdown , mapping the other channel to get an atmospheric and glitchy feel
 //everything is mapped to the other channel since that is the main focal point of the intro alongside the vocals
 
  let otherAmount3= map(other,0,100,0.000005,0.01);
  angleCounter += 0.003 +otherAmount3 ; //this sets the angle/axis that the pattern is generated at
  textureNoiseCounter += 0.01 +otherAmount3  ; // how much noise is added, adjusting this increases the amount of noise impact on the pattern
 }
}

function waves(x, y, patternColour) {
  //function to clean up the pattern function code
  //this is the thing that is creating the waves/patterns, it is using noise to modulate the x and y positions and size of the particle shape, eg line or rect.
    
  let noiseX = textureNoiseCounter + x / waveScale; // how much the noise modulators effect the x axis
    let noiseY = textureNoiseCounter + y / waveScale; //how much they effect the y axis
  
    let offset = map(noise(noiseX, noiseY), 0, 1, -wavesOffamount, wavesOffamount);//using map to control the amount the noise can offset the patterns to a legible range. if this is not done, it just becomes a too random if at small numbers, and it is not visible at large numbers. This range makes it visible at all times
    let field = map(noise(x, y), 0, 1, noiseMap1, noiseMap2); // an additional map, to control the distance of the noise again
  
    strokeWeight(1);// setting the line weight
    
    if (field < offset) offset = field; // setting the offset to switch to the second modulator if it goes below the field amount, this just adds more variation and modulation
  
    if (wavesShape === "line") { //if waveshape= line make the carrier shape a line for the pattern
      stroke(patternColour);// pattern Colour allows one line of code to select between pink or blue instead of having to do if statements
      noFill();
      line(x + offset, y + offset, x + offset * 2, y + offset * 2);// offsetting the line coordinates using the offse, which is controlled by the noise, this creates the pattern 
    } 
    
    else if (wavesShape === "rect") { //if the waveshape seletor is rectangles do this
      stroke(0); //black stroke to make the squares visible when close together or overlayed
      fill(patternColour); // Use patternColour as way to s
      rectMode(CENTER);
      rect(x + offset, y + offset, offset * 2, offset * 2);//offset is the noise modualation, controlling the position and size of the object to create the pattern
    }
    
   
     else if (wavesShape === "ellipse") { //if the waveshape selector is ellipses do this
      stroke(0); //black stroke to make the ellipses visible when close together or overlayed
      fill(patternColour); // Use patternColour to fill the ellipses
      ellipseMode(CENTER);
      ellipse(x + offset, y + offset, (offset * 2), (offset * 2));//offset is the noise modualation, controlling the position and size of the ellipse to create the pattern, using abs to avoid negative sizes
    }
  }
function patternTimeBasedControls(seconds, counter, drum, bass, other){

//to clean up the code in drawOneFrame
  // if statements that control whether a pattern layer is visible, what shape it is and how many pattern layers
  // based on seconds which is controlled by the counter variable/60
 
  //intro
  //lines
  if (seconds >= 0 && seconds < 87) { //intro pattern, 1 layer of line patterns that grow in intensity over time to body 1
    wavesShape = "line";
    patternLayers = 1;
    patternVisible = true;
  }
  if (seconds >= 86 && seconds < 88) {  //pause before body 1, synced to what is happening in the song
    patternVisible = false;
  }

  //first body section
  if (seconds >= 88 && seconds < 109.5) { //body 1, 1 layer of line patterns
    wavesShape = "line";
    patternLayers = 1;
    patternVisible = true;
  }
  if (seconds >= 109.5 && seconds < 110) { //pause before body 2, synced to music/drums
    patternVisible = false;
  }
  if (seconds >= 110 && seconds < 132) {//body 2, two layers of line patterns
    wavesShape = "line";
    patternLayers = 2;
    patternVisible = true;
  }
  if (seconds >= 132 && seconds < 135) {  //pause before body 3, synced to the music/drums
    patternVisible = false;
  }

  //rectangles
  if (seconds >= 135 && seconds < 155.5) { // body 3, 1 layer of rectangle patterns
    wavesShape = "rect"; // setting the pattern carrier object to rectangles to create variation, this allowed me to create visually different variations from one block of code, saving performance
    patternLayers = 1;//how many layers of rectangle patterns should be playing
    patternVisible = true;
  }

  if (seconds >= 155.5 && seconds < 157) { //pause before body 4, synced to the music/drums
    patternVisible = false;
  }
 
  if (seconds >= 157 && seconds < 175) {//4th body, 2 layers of rectangles
    wavesShape = "rect";   
    patternLayers = 2; //two rectangular layers of patterns
    patternVisible = true;
  
  }
 
 
//breakdown
  if (seconds >= 175 && seconds < 175.5) { //pause before breakdown, synced to the music/drums
    patternVisible = false;
  }

  if (seconds >= 175.5 && seconds < 220) {//breakdown , 1 layers of rectangles
    wavesShape = "rect";   
    patternLayers = 1; //two rectangular layers of patterns
    patternVisible = true;
  }
  if (seconds >= 220 && seconds < 223) { //pause before body 5, synced to the music/drums
    patternVisible = false;
  }
 

  if (seconds >= 223 && seconds < 244) {//body 5, 1 layers of ellipses
    wavesShape = "ellipse";   
    patternLayers = 1; //two layers of patterns
    patternVisible = true;
  }

  if (seconds >= 244 && seconds < 245) {  //pause before body 6, synced to the music/drums
    patternVisible = false;
  }

  //second body section
  if (seconds >= 245 && seconds < 263.5) {//6th body, 2 layers of ellipses
    wavesShape = "ellipse";   
    patternLayers = 2; //two layers of patterns
    patternVisible = true;
  }
  

  if (seconds >= 263.5 && seconds < 264) { //pause before body 7, synced to music/drums
    patternVisible = false;
  }

  if (seconds >= 264.5 && seconds < 286.5) { //body 7, 1 layer of line patterns
    wavesShape = "line";
    patternLayers = 2;
    patternVisible = true;
  }
  if (seconds >= 286.5 && seconds < 287) { //pause before body 8, synced to music/drums
    patternVisible = false;
  }
  if (seconds >= 287 && seconds < 331) {//body 8, two layers of line patterns
    wavesShape = "line";
    patternLayers = 1;
    patternVisible = true;
  }


  if (counter > 0) { // saying to only run if the song is playing
    
    let pink = color(255, 25, 104); //pattern colours
    let blue = color(0,0,255);

    
    //using the drum channel to add in desaturated glitches to the pattern

    if (drum <40){  //mapping the drum channel to the pink colour to get desaturated effect in a more controlled way than lerpColor, I did not like the inbetween colours lerp cor created so wanted to do it in a more on/off switch way to toggle between two colours
     //this gives more change over the intro and breakdown and adds to the build up as the pink comes in more and more as the drums get louder towards body
      pink = color(120); //grey
    }

    if (drum <50){  //mapping the drum channel to the blue colour to get desaturated glitchy effect in a more controlled way than lerpColor
    //this adds in a subtle glitch effect in the body sections
      blue = color(120); //grey
    }

  

    if (patternVisible) { // this is what plays if the pattern is not paused
      if (patternLayers === 1) { // play this if there if the parameter pattern layers = 1.
        push();
        pattern(seconds, pink, 'pink', counter,drum,bass,other); //one layer of pattern patterns that are pink
        pop();
      } 
      else if (patternLayers === 2) {// this is saying add the blue pattern pattern ontop of the pink layer if pattern layers is set to 2
        push();
        pattern(seconds, pink, 'pink', counter,drum,bass,other); // original pink pattern layer named pink
        pop();

        push();
        pattern(seconds, blue, 'blue', counter,drum,bass,other); //additional blue layer in sections 2 pattern layers are called
        pop();
      }
    } 
    
    else { // this is to keep the pattern pattern going even when not visible on the sketch for the pause sections. This means that there is no weird timing issues or it starting over from the beginning everytime
      
      patternModulators(seconds, drum, bass, other); // seperate function to make the code more legible when it is repeated three times below
      //this makes sure the pattern still continues when not visible
      if (patternLayers === 2) { // if statement for if there are two pattern layers playing in the sketch. means both layers will continue playing behind the scenes
        patternModulators(seconds, drum, bass, other); //since there are two layers, the modulators needs to be called twice.
        patternModulators(seconds, drum, bass, other);
      } 
      else { //if there is just one layer, call it just once. 
        patternModulators(seconds, drum, bass, other);
      }
    }
}
}

function lEDoverlay(){
  //to clean up the code in drawoneframe
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