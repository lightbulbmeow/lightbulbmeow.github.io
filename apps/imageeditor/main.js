// file handling

const fileinput = document.getElementById('fileinput')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const srcImage = new Image

let imgData, pix
let w,x,y,r,g,b,a

fileinput.onchange = function (e) {
  if (e.target.files && e.target.files.item(0)) {
    srcImage.src = URL.createObjectURL(e.target.files[0])
  }
}

function resetImage(){
  canvas.width = srcImage.width
  canvas.height = srcImage.height
  w = canvas.width
  h = canvas.height
  ctx.drawImage(srcImage, 0, 0, srcImage.width, srcImage.height)
  imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)
}

srcImage.onload = resetImage

function getcoord(x,y){
  return (x + y * w) * 4
}

function pixel(x,y){
  coord = getcoord(x,y)
  return [imgData.data[coord], imgData.data[coord+1], imgData.data[coord+2], imgData.data[coord+3]]
}

// code handling

const inputcode = document.getElementById('inputcode')

function applyCode(){
  eval(inputcode.value);
  //newdata = new Uint8ClampedArray(imgData.data.length)

  for(let x = 0; x < w; x ++){
    for(let y = 0; y < h; y ++){
      [r,g,b,a] = pixel(x,y)
      rgba = setpixel(x,y)
      if(rgba.length == 3) rgba.push(255)
      coord = getcoord(x,y)
      arr = [0,1,2,3]
      arr.forEach(i => {imgData.data[coord+i] = rgba[i]})
    }
  }
  ctx.putImageData(imgData, 0, 0, 0, 0, w, h)
}

function saveImage(){
    const createEl = document.createElement('a');
    createEl.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    createEl.download = "image.png";
    createEl.click();
    createEl.remove();
}
