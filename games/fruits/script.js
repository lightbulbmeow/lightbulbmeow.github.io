function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d');

var mousePos = {x:0,y:0};

canvas.addEventListener("mousemove", function(e) { 
   mousePos = getMousePos(canvas, e); 
}); 

var base_image = [0,0,0,0,0];

function make_base(link,i,x,y)
{
  base_image[i] = new Image();
  base_image[i].src = link;
  ctx.drawImage(base_image[i], x, y);
}

function movechar(e){
    if(e.keyCode == 37){ speedx = -2; }
    if(e.keyCode == 38){ speedy = -2; }
    if(e.keyCode == 39){ speedx = 2; }
    if(e.keyCode == 40){ speedy = 2; }
}
    
function stopchar(e){
    if(e.keyCode == 37){ speedx = 0; }
    if(e.keyCode == 38){ speedy = 0; }
    if(e.keyCode == 39){ speedx = 0; }
    if(e.keyCode == 40){ speedy = 0; }
}

var curx = 30;
var cury = 50;
var speedx = 0;
var speedy = 0;

var applex = [100,150,50,200];
var appley = [200,50,100,150];
var collided = [0,0,0,0]

function collision(i){
    if(curx - 16 < applex[i] & applex[i] < curx + 27 & cury - 19 < appley[i] & appley[i] < cury + 41 & collided[i] == 0){
        collided[i] = 1;
    }
}
  
function draw() {
    
  ctx.clearRect(0, 0, 250, 250); // clear canvas
  
  curx += speedx;
  cury += speedy;
  
  if(curx < 0){
      curx = 0;
      window.moveBy(-2,0);
  }
  if(curx > 250-25){
      curx = 250-25;
      window.moveBy(2,0);
  }
  if(cury < 0){
      cury = 0;
      window.moveBy(0,-2);
  }
  if(cury > 250-39){
      cury = 250-39;
      window.moveBy(0,2);
  }
  
  for(var i = 0; i < 4; i ++){
      collision(i);
      if(collided[i] == 0){
          make_base("ah.png",i,applex[i],appley[i]);
      }
  }
  
  make_base("ha.png",4,curx,cury);
  
  window.requestAnimationFrame(draw);
}

window.addEventListener('keydown',this.movechar,false);
window.addEventListener('keyup',this.stopchar,false);

window.requestAnimationFrame(draw);
