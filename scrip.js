function writeMessage(canvas, message, xx, yy, xxx, yyy) {
  var context = canvas.getContext('2d');

  context.beginPath();
  context.lineWidth = Math.sin((xx+yy)/50)*30+30;
  context.lineCap = "round";
  context.strokeStyle = "#" + Math.floor(xx/1500*255).toString(16) + Math.floor(yy/250*255).toString(16);
  context.moveTo(xxx,yyy);
  context.lineTo(xx, yy);
  context.stroke();
}
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
var canvas = document.getElementById('canvasthing');
var context = canvas.getContext('2d');

var prevx=0;
var prevy=0;

canvas.addEventListener('mousemove', function(evt) {
  var mousePos = getMousePos(canvas, evt);
  var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
  writeMessage(canvas, message, mousePos.x, mousePos.y, prevx, prevy);
  prevx = mousePos.x;
  prevy = mousePos.y;
}, false);

init();
