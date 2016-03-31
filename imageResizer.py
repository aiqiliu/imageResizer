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
#orginal image dimension
im = Image.open('input/' + image_name + '.jpg')

currDimension = im.size
print("Current dimension of " + image_name + ".jpg" + " is: " + str(currDimension[0]) + " x " + str(currDimension[1]))

#get required dimension. width/height 
print("Please specify either of desired image width or height")
width = raw_input('Desired width: ')
height = raw_input('Desired height: ')
if width == "":
	mode = 2 #width null
else:
	mode = 1 #height null
	print("mode is 1")

#check if the required dimension already exist 
#desired matches with curr
if mode == 1 and currDimension[0] == int(width):
	print("Desired image matches with current dimension")
if mode == 2 and currDimension[1] == int(height):
	print("Desired image matches with current dimension")
#desired matches with one of output
if os.path.isfile(image_name):
	#output filename format: imagename_widthxheight.jpg
	for file in os.listdir("image_name"):
		if mode == 1: #grab the width chunk
			start = file.find("_")
			end = file.find("x") + 1
			if file[start:end] == width:
				print("Desired image dimension already exists")
		if mode == 2:
			start = file.find("x")
			end = file.find(".") + 1
			if file[start:end] == height:
				print("Desired image dimension already exists")
else:
	#desired version doesnt exist. RESIZE


















