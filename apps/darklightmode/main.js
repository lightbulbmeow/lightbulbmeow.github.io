// file handling

const fileinput1 = document.getElementById('fileinput1')
const fileinput2 = document.getElementById('fileinput2')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const loading = document.getElementById('loading')

const tempcanvas = document.createElement("canvas")
const tempctx = tempcanvas.getContext('2d')

let imgData1, imgData2

const tempsrcImage1 = new Image
const tempsrcImage2 = new Image

function extractImageData(srcImage){ //also attempts to resize if different sizes
  let h = tempcanvas.height
  let w = Math.round(h * srcImage.width / srcImage.height)
  tempctx.clearRect(0, 0, tempcanvas.width, tempcanvas.height)
  tempctx.drawImage(srcImage, 0, 0, w, h)
  return tempctx.getImageData(0, 0, tempcanvas.width, tempcanvas.height)
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

function buttonClick(){
  loading.innerText = "Loading..."
  setTimeout(generateImage)
}

function generateImage(){
  // take the image with bigger height, then scale the other image to that height
  h = Math.max(tempsrcImage1.height, tempsrcImage2.height)
  w = Math.round(Math.max(h * tempsrcImage1.width / tempsrcImage1.height, h * tempsrcImage2.width / tempsrcImage2.height))
  tempcanvas.width = w
  tempcanvas.height = h
  imgData1 = extractImageData(tempsrcImage1)
  imgData2 = extractImageData(tempsrcImage2)

  newimgData = new ImageData(w,h)

  for(let x = 0; x < w; x ++){
    for(let y = 0; y < h; y ++){
      [r,g,b,a] = pixel(imgData1,x,y)
      y1 = darkgray(r,g,b,a); // this semicolon is important somehow???
      [r,g,b,a] = pixel(imgData2,x,y)
      y2 = lightgray(r,g,b,a);

      y1 = y1/2
      y2 = y2/2 + 255/2

      a = 255-y2+y1
      if(a == 0) r = 0
      else r = y1/a

      coord = (x + y*w)*4
      for(const i of [0,1,2]){
        dark = Number("0x" + darkColor[2*i+1] + darkColor[2*i+2])
        light = Number("0x" + lightColor[2*i+1] + lightColor[2*i+2])
        newimgData.data[coord+i] = dark*(1-r) + light*r
      }
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
