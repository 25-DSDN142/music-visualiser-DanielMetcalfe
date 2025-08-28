let firstRun = true; //image preload

//animated face paramaters
let faceFrames = [];       //setting up animation using array of images
let faceImageAmount = 24; //total images in array
let currentImage = 0; // current image in foreloop

function draw_one_frame(words, vocal, drum, bass, other, counter) {
  background(0);

  loadFaceImages();

 if (counter>0){ //making it so that the animation only happens when the song is playing

    image(faceFrames[currentImage], 0, 0, width, height); ///imaging the animation by imaging the current image from the array

    if (frameCount % 5 === 0) { //setting the framerate of the animation to 12Fps to get that stop motion look, while keeping the total sketch framerate at 60fps
    currentImage = (currentImage + 1) % faceImageAmount; // tells the loop to go to the next image
  }
}
}


function loadFaceImages() {
  //function to load images, so that the draw one frame function is cleaner

  if (firstRun) { //image preload
    for (let x = 1; x <= faceImageAmount; x++) {   //for loop so that I don't have to call away 24+ images individually, starting at 1 instead of 0 since it is being used to call the name of the image which starts at 1.png
      faceFrames.push(loadImage("face/" + x + ".png"));  //loading images from folder named face to keep side bar clean with so many images
    }
    firstRun = false;
  }
}