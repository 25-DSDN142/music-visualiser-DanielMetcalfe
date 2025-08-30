let firstRun = true; //image preload

//animated face paramaters
let faceFrames = [];       //setting up animation using array of images
let faceImageAmount = 24; //total images in array
let currentImage = 0; // current image in foreloop
let img;




function draw_one_frame(words, vocal, drum, bass, other, counter) {
  background(0);

  if (counter > 0) { //making it so that the animation only happens when the song is playing
faceLayer();


  }
}

function loadFaceImages() {
  //function to load images, so that the draw one frame function is cleaner
  for (let x = 1; x <= faceImageAmount; x++) {   //for loop so that I don't have to call away 24+ images individually, starting at 1 instead of 0 since it is being used to call the name of the image which starts at 1.png
    faceFrames.push(loadImage("face/" + x + ".jpg"));  //loading images from folder named face to keep side bar clean with so many images
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

    if (frameCount % 5 === 0) { //setting the framerate of the animation to 12Fps to get that stop motion look, while keeping the total sketch framerate at 60fps
      currentImage = (currentImage + 1) % faceImageAmount; // tells the loop to go to the next image
    }

   //adding a led screen like effect so it matches rest of animation layers that will be created in p5
   //doing it in a more processor friendly way of just overlaying a grid of ellipses on top of the animation
   
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
