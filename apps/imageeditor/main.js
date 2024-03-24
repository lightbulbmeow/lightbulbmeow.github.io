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
  }
}

function resetImage(){
  w = srcImage.width
  h = srcImage.height
  canvas.width = w
  canvas.height = h
  ctx.drawImage(srcImage, 0, 0, w, h)
  imgData = ctx.getImageData(0, 0, w, h) // the data is given as an array of 4*w*h bytes [r,g,b,a,r,g,b,a,...]
}

srcImage.src = "manunchan.png"
srcImage.setAttribute('crossOrigin', '') // cors nonsense
srcImage.onload = resetImage


// code handling

const loading = document.getElementById('loading')
const inputcode = document.getElementById('inputcode')

function pixel(x,y){
  x = Math.round(x)
  y = Math.round(y)
  if(x < 0 || x >= imgData.width || y < 0 || y >= imgData.height) return [0,0,0,0] // pixel is out of bounds
  coord = (x + y * imgData.width) * 4
  return [imgData.data[coord], imgData.data[coord+1], imgData.data[coord+2], imgData.data[coord+3]]
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
}


// image saving

function saveImage(){
    const createEl = document.createElement('a')
    createEl.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
    createEl.download = "image.png"
    createEl.click()
    createEl.remove()
}
