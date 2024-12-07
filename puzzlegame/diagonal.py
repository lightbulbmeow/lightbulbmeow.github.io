edges = [(0,0,0,4),(0,3,1,2),(1,2,2,3),(2,3,1,4),(1,4,0,4),(3,0,3,4),(4,2,4,3),(4,3,5,4),(5,4,6,3),(6,2,6,4),(7,3,8,2),(8,2,9,3),(9,3,7,3),(7,3,8,4),(8,4,9,4)]
answers = []
for x1,y1,x2,y2 in edges:
    (x1,y1),(x2,y2) = sorted([(x1,y1),(x2,y2)])
    if x1 == x2:
        answers.append((y1,x1,.2,y2-y1,0,x1,y1,x2,y2))
    elif y1 == y2:
        answers.append((y1,x1,x2-x1,.2,0,x1,y1,x2,y2))
    elif y1 < y2:
        xc,yc = ((x1+x2)/2,(y1+y2)/2)
        answers.append((yc-(x2-x1)*2**.5/2,xc,.2,(x2-x1)*2**.5,-45,x1,y1,x2,y2))
    else:
        xc,yc = ((x1+x2)/2,(y1+y2)/2)
        answers.append((yc-(x2-x1)*2**.5/2,xc,.2,(x2-x1)*2**.5,45,x1,y1,x2,y2))

answers.sort()
for y,x,w,h,r,x1,y1,x2,y2 in answers:
    if r == 0:
        print(f'<img src="pixel.png" style="position: absolute; top: {int(y*50)}px; left: {int(x*50)}px; width:{int(w*50)}px; height: {int(h*50)}px;">')
    else:
        print(f'<img src="pixel.png" style="position: absolute; top: {int(y*50)}px; left: {int(x*50)}px; width:{int(w*50)}px; height: {int(h*50)}px; transform: rotate({r}deg);">')
