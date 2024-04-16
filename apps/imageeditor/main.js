// ui

const inputcode = document.getElementById('inputcode')
const loading = document.getElementById('loading')
const mouseinfo = document.getElementById('mouseinfo')

// file handling

const fileinput = document.getElementById('fileinput')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const srcImage = new Image

let imgData
let w,h,r,g,b,a

fileinput.onchange = function (e) {
  if (e.target.files && e.target.files.item(0)) {
    srcImage.src = URL.createObjectURL(e.target.files[0])
    loading.innerText = ""
  }
}

function resetImage(){
  w = srcImage.width
  h = srcImage.height
  canvas.width = w
  canvas.height = h
  ctx.drawImage(srcImage, 0, 0, w, h)
  imgData = ctx.getImageData(0, 0, w, h) // the data is given as an array of 4*w*h bytes [r,g,b,a,r,g,b,a,...]
  showDimensions()
}

srcImage.src = "manunchan.png"
srcImage.setAttribute('crossOrigin', '') // cors nonsense
srcImage.onload = resetImage



// mouse position

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return [Math.round(evt.clientX - rect.left), Math.round(evt.clientY - rect.top)]
}

function mouseMove(e){
  [mx,my] = getMousePos(canvas, e)
  mouseinfo.innerText = "Mouse position: [" + [mx,my] + "], RGBA: [" + pixel(mx,my) + "]"
}

function showDimensions(){
  mouseinfo.innerText = "Image dimensions: [" + [w,h] + "]"
}



// code handling

function pixel(x,y){
  x = Math.round(x)
  y = Math.round(y)
  if(x < 0 || x >= imgData.width || y < 0 || y >= imgData.height) return [0,0,0,0] // pixel is out of bounds
  coord = (x + y * imgData.width) * 4
  return [imgData.data[coord], imgData.data[coord+1], imgData.data[coord+2], imgData.data[coord+3]]
}

function rgb_to_hsv(r,g,b){
  cmax = Math.max(r,g,b)
  cmin = Math.min(r,g,b)
  delta = cmax - cmin
  let h
  if(delta == 0) h = 0
  else if(cmax == r) h = ((g-b)/delta + 6) % 6  // because (-1) % 6 = -1 in javascript :nanableh:
  else if(cmax == g) h = (b-r)/delta + 2
  else if(cmax == b) h = (r-g)/delta + 4
  h *= 60

  if(cmax == 0) s = 0
  else s = delta/cmax

  v = cmax/255
  return [h,s,v]
}

function hsv_to_rgb(h,s,v){
  h = (h % 360 + 360) % 360
  c = v*s
  x = c*(1 - Math.abs(h/60 % 2 - 1))
  m = v - c
  if(h < 60) [r,g,b] = [c,x,0]
  else if(h < 120) [r,g,b] = [x,c,0]
  else if(h < 180) [r,g,b] = [0,c,x]
  else if(h < 240) [r,g,b] = [0,x,c]
  else if(h < 300) [r,g,b] = [x,0,c]
  else [r,g,b] = [c,0,x]
  return [(r+m)*255, (g+m)*255, (b+m)*255]
}

function applyCode(){
  loading.innerText = "Loading..."
  setTimeout(runCode)
}

function runCode(){
  eval(inputcode.value)
  w = Math.trunc(w)
  h = Math.trunc(h)
  newimgData = new ImageData(w,h)

  for(let x = 0; x < w; x ++){
    for(let y = 0; y < h; y ++){
      [r,g,b,a] = pixel(x,y)
      rgba = setpixel(x,y)
      if(rgba.length == 3) rgba.push(a)
      coord = (x + y * w) * 4
      for(const i of [0,1,2,3]) newimgData.data[coord+i] = rgba[i]
    }
  }

  imgData = newimgData
  canvas.width = w
  canvas.height = h
  ctx.putImageData(imgData, 0, 0, 0, 0, w, h)

  loading.innerText = "Done!"
  showDimensions()
}


// image saving

function saveImage(){
    const createEl = document.createElement('a')
    createEl.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
    createEl.download = "image.png"
    createEl.click()
    createEl.remove()
}
