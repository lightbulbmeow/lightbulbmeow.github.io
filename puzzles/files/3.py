# generate image

from PIL import Image
from random import shuffle

img1 = Image.open('3a.png')
pix1 = img1.load()
img2 = Image.open('3b.png')
pix2 = img2.load()

black = [(r,g,0) for g in range(256) for r in range(256) if pix1[g,r][2]==0]
blue = [(r,g,255) for g in range(256) for r in range(256) if pix1[g,r][2]==255]

shuffle(black)
shuffle(blue)

blackcount = 0
bluecount = 0

for y in range(256):
    for x in range(256):
        if pix2[x,y][2] == 0:
            pix2[x,y] = black[blackcount]
            blackcount += 1
        else:
            pix2[x,y] = blue[bluecount]
            bluecount += 1

img2.save('3.png')

'''
def fat(img):
    pix = img.load()
    img2 = Image.new('RGBA',(256,256),(0,0,0))
    pix2 = img2.load()
    for x in range(256):
        for y in range(256):
            if any(0<=x+dx<=255 and 0<=y+dy<=255 and pix[x+dx,y+dy][2]==255 for dx,dy in [(0,0),(0,1)]):
                pix2[x,y] = (0,0,255)
            else:
                pix2[x,y] = (0,0,0)
    return img2
'''

# sort pixels

from PIL import Image

img = Image.open('3.png')
pix = img.load()

rgb = [pix[x,y] for x in range(256) for y in range(256)]
rgb.sort()

for y in range(256):
    for x in range(256):
        pix[x,y] = rgb[x+256*y]

img.save('3sol.png')
