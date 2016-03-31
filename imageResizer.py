#!/usr/bin/env python
# image resizer using PIL JPEG
# parameters: image_name [required], width [required|optional], height [required|optional], compression [optional]
# ouput: if required image doesnt exist or the required dimension aligns with the current one -> return false
# else: compression 0-100
import PIL
import os
from PIL import Image

#get image name
image_name = raw_input('Image name: ')
#print(image_name)

#check if that image exists in input file
if not os.path.isfile('input/' + image_name + '.jpg'):
	print("Image doesn't exist")
#get 
