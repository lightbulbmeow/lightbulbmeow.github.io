// file handling

const fileinput1 = document.getElementById('fileinput1')
const fileinput2 = document.getElementById('fileinput2')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const tempcanvas = document.createElement("canvas")
const tempctx = tempcanvas.getContext('2d')

let imgData1, imgData2

const tempsrcImage1 = new Image
const tempsrcImage2 = new Image

function extractImageData(srcImage,w,h){ //also attempts to resize if different sizes
  tempcanvas.width = w
  tempcanvas.height = h
  tempctx.drawImage(srcImage, 0, 0, w, h)
  return tempctx.getImageData(0, 0, w, h)
}

fileinput1.onchange = function (e) {
  if (e.target.files && e.target.files.item(0)) {
    tempsrcImage1.src = URL.createObjectURL(e.target.files[0])
  }
}

fileinput2.onchange = function (e) {
  if (e.target.files && e.target.files.item(0)) {
    tempsrcImage2.src = URL.createObjectURL(e.target.files[0])
  }
}

function buttonClick(){
  loading.innerText = "Loading..."
  setTimeout(generateImage)
}

function darkgray(r,g,b,a){
  return (0.2126*r + 0.7152*g + 0.0722*b) * a/255
}

function lightgray(r,g,b,a){
  return (0.2126*r + 0.7152*g + 0.0722*b) * a/255 + 255 - a
}

function pixel(img,x,y){
  coord = (x + y * img.width) * 4
  return [img.data[coord], img.data[coord+1], img.data[coord+2], img.data[coord+3]]
}

const DARKCOLOR = 51
const LIGHTCOLOR = 255

function generateImage(){
  w = tempsrcImage1.width
  h = tempsrcImage1.height
  imgData1 = extractImageData(tempsrcImage1,w,h)
  imgData2 = extractImageData(tempsrcImage2,w,h)

  newimgData = new ImageData(w,h)

  for(let x = 0; x < w; x ++){
    for(let y = 0; y < h; y ++){
      [r,g,b,a] = pixel(imgData1,x,y)
      y1 = darkgray(r,g,b,a); // this semicolon is important somehow???
      [r,g,b,a] = pixel(imgData2,x,y)
      y2 = lightgray(r,g,b,a);

      // system of equations:
      // r*a/255 + DARKCOLOR*(1-a/255) = y1
      // r*a/255 + LIGHTCOLOR*(1-a/255) = y2

      y1 = (y1/2)/255*(LIGHTCOLOR-DARKCOLOR) + DARKCOLOR
      y2 = (y2/2)/255*(LIGHTCOLOR-DARKCOLOR) + DARKCOLOR + (LIGHTCOLOR-DARKCOLOR)/2

      a = 255*(LIGHTCOLOR-DARKCOLOR-y2+y1)/(LIGHTCOLOR-DARKCOLOR)
      if(a == 0) r = 0
      else r = (LIGHTCOLOR*y1-DARKCOLOR*y2)/(LIGHTCOLOR-DARKCOLOR-y2+y1)

      coord = (x + y*w)*4
      for(const i of [0,1,2]) newimgData.data[coord+i] = r
      newimgData.data[coord+3] = a
    }
  }

  canvas.width = w
  canvas.height = h
  ctx.putImageData(newimgData, 0, 0, 0, 0, w, h)

  loading.innerText = "Done!"
}


// image saving

function saveImage(){
    const createEl = document.createElement('a')
    createEl.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
    createEl.download = "image.png"
    createEl.click()
    createEl.remove()
}
