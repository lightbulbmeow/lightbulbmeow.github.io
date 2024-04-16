function writeMessage(canvas, message, xx, yy, xxx, yyy) {
  let context = canvas.getContext('2d');

  context.beginPath();
  context.lineWidth = Math.sin((xx+yy)/50)*30+30;
  context.lineCap = "round";
  context.strokeStyle = "#" + Math.floor(xx/1500*255).toString(16) + Math.floor(yy/250*255).toString(16);
  context.moveTo(xxx,yyy);
  context.lineTo(xx, yy);
  context.stroke();
}
function getMousePos(canvas, evt) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
let canvas = document.getElementById('canvasthing');
let context = canvas.getContext('2d');

let prevx=0;
let prevy=0;

canvas.addEventListener('mousemove', function(evt) {
  let mousePos = getMousePos(canvas, evt);
  let message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
  writeMessage(canvas, message, mousePos.x, mousePos.y, prevx, prevy);
  prevx = mousePos.x;
  prevy = mousePos.y;
}, false);

init();
