import cv2
import os

# 92
characters = " `.-':_,^=;><+!rc*/z?sLTv)J7(|Fi}{CfI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpOGbUAKXHm8RD#$Bg0MNWQ%&@"

def key(val):
    val = (int)((val/256) * 92)


    

    return characters[val]
key(2)



cv2.namedWindow("preview")
vc = cv2.VideoCapture(0)
vc.set(3, 176)
vc.set(4, 176)
x = 176
y = 144

if(vc.isOpened()):
    rval, frame = vc.read()
else:
    rval = False

while(rval):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    cv2.imshow("preview", gray)

    image = ""
    for i in range(0, y-1):
        image += "\n"
        for j in range(0, x):
            image += key(gray[i][j])
    
    os.system("cls")
    image += "\n"
    print(image)

    
    rval, frame = vc.read()
    key_press = cv2.waitKey(20)
    if key_press == 27:
        break

cv2.destroyWindow("preview")
vc.release()