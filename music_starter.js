


// vocal, drum, bass, and other are volumes ranging from 0 to 100

function draw_one_frame(words, vocal, drum, bass, other, counter) {
   colorMode(HSB,360,100,100);
  let bg = map(bass,0,100,0,255); //maps the h value in hsb colour mode for the background colour 
   
  if (frameCount % 50==0){ //allows for the trail effect that nobackground provides but it adds in a background every 50 frames to not make it a big mess
  background(bg,100,100);
   }
  

  let yMove= map(bass,0,100,200,height) ;// maps the bass to the y position of the rectangle
 


  let h= map(drum,0,100,245,360);// maps the drum value to H value in HSB colour mode for the fill

  let gridsX= map(vocal,0,100,1,20); //maps the vocal to the amount of rectangles used in the for loop 

  for (let x = 0; x < gridsX; x ++){
   let rectY= yMove;
  
   let rectW= (width/gridsX) * x;
  
   fill(h,100,100);
   rect(rectW,rectY,50,50);

  }


}