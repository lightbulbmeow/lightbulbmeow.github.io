// list of example codes

const examplecodes = document.getElementById('examplecodes')

const codelist = [{

'Flip horizontal': `function setpixel(x,y){
    return pixel(w-1-x,y)
}`,

'Rotate 90°': `[w,h] = [h,w]
function setpixel(x,y){
    return pixel(y,w-1-x)
}`,

'Shrink': `w /= 2
h /= 2
function setpixel(x,y){
    return pixel(2*x,2*y)
}`,

'Crop': `w /= 2
h /= 2
function setpixel(x,y){
    return pixel(x+w/2, y+h/2)
}`,

'Swirl': `function setpixel(x,y){
    x -= w/2
    y -= h/2
    dist = Math.sqrt(x*x + y*y)
    angle = Math.atan2(y,x) + dist/100
    return pixel(w/2 + dist * Math.cos(angle), h/2 + dist * Math.sin(angle))
}`,

},
{

'Invert colors': `function setpixel(x,y){
    return [255-r,255-g,255-b]
}`,

'Hue shift': `function setpixel(x,y){
    return [g,b,r]
}`,

'Edge detection': `function setpixel(x,y){
    return [0,1,2].map(i => Math.abs(pixel(x,y)[i] - pixel(x-1,y)[i]))
}`,

'Light mode': `function setpixel(x,y){
    y = (0.2126*r + 0.7152*g + 0.0722*b) * a/255
    return [255,255,255,y]
}`,

'Rainbow': `function setpixel(x,y){
    let h,s,v
    [h,s,v] = rgb_to_hsv(r,g,b)
    return hsv_to_rgb(h + x/w * 360, s, v)
}`,

}]

for(const line of codelist){
    for(const [key, value] of Object.entries(line)){
        examplecodes.innerHTML += '<button onclick="presetCode(`' + value + '`)">' + key + '</button> '
    }
    examplecodes.innerHTML += '<p/>'
}

function presetCode(value){
  inputcode.value = value
}
