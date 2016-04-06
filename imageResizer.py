#!/usr/bin/env python
# image resizer using PIL JPEG
# parameters: image_name [required], width [required|optional], height [required|optional], compression [optional]
# ouput: if required image doesnt exist or the required dimension aligns with the current one -> return false
# else: compression 0-100
import PIL
import os
import sys
from PIL import Image

#print("Please type in arguments in order of 'file name' 'width--number'/'height--number'")
#take inputs, as a list 
def file_exits():
	#get image name
	image_name = sys.argv[1]
	print(sys.argv[1])
	sys.exit()
	#check if that image exists in input file
	if not os.path.isfile('input/' + image_name + '.jpg'):
		print("File doesn't exist")
		return False

	#orginal image dimension
	im = Image.open('input/' + image_name + '.jpg')

	currDimension = im.size
	print("Current dimension of " + image_name + ".jpg" + " is: " + str(currDimension[0]) + " x " + str(currDimension[1]))

	#get required dimension. width/height 
	#print("Please specify either of desired image width or height")
	if 'width' in sys.argv[2]:
		width = sys.argv[2][7:]
		height = ""
		print("desired width is: " + width)
	else:
		height = sys.argv[8:]
		width = ""
		print("desired height is: " + height)

if width == "":
	mode = 2 #width null
else:
	mode = 1 #height null
	
#check if the required dimension already exist 
#desired matches with curr
if mode == 1 and currDimension[0] == int(width):
	sys.exit("Desired image matches with current dimension")
if mode == 2 and currDimension[1] == int(height):
	sys.exit("Desired image matches with current dimension")

def generateNew(image_name, width, height, currDimension):
	# if scaling(mode, width, height, currDimension) == False: #cant scale up, return original
	# 	print("cannot scale up")
	# 	return im
	if os.path.isdir('./'+str(image_name)): #desired matches with one of output
		#output filename format: imagename_widthxheight.jpg
		for file in os.listdir('./'+str(image_name)):
			if mode == 1: #grab the width chunk
				start = file.find("_") + 1
				end = file.find("x")
				if file[start:end] == width:
					sys.exit("Desired image dimension already exists")
			if mode == 2:
				start = file.find("x") + 1
				end = file.find(".") 
				if file[start:end] == height:
					sys.exit("Desired image dimension already exists")
		rescale(image_name, width, height, currDimension) #desired file not in output folder
	else:
		rescale(image_name, width, height, currDimension)


# 	#desired version doesnt exist. RESIZE

def rescale(image_name, width, height, currDimension):
	newDimension = scaling(mode, width, height, currDimension) #get new dimension
	newDimension = category(newDimension)
	if mode == 1:
		width = newDimension
		percent = (newDimension/float(currDimension[0])) #calculate aspect ratio
		height = int((float(currDimension[1])*float(percent)))
	else:
		height = newDimension
		percent (newDimension/float(currDimension[1])) #calculate aspect ratio
		width = int((float(currDimension[0])*float(percent)))
	newSize = [width, height]
	im.thumbnail(newSize, PIL.Image.ANTIALIAS) #resize
	
	if not os.path.isdir('./'+str(image_name)): #if folder of image doesnt exist 
		os.makedir(str(image_name))

	outPath = "./" + str(image_name) + "/" + str(image_name) + "_" + str(width) + "x" + str(height) + ".jpg" #ex. flo/flo_100x100.jpg
	print("new image file")
	im.save(outPath, "JPEG")


def scaling(mode, width, height, currDimension):
	if mode == 1:
		if currDimension[0] < width:
			return False #scale up, return the original image
		else:
			return int(width)
	if mode == 2:
		if currDimension[1] < height:
			return False
		else:
			return int(height)

def category(newDimension):
	if newDimension >= 0 and newDimension <= 150:
		return 100
	elif newDimension >= 151 and newDimension <= 250:
		return 200
	elif newDimension >= 251 and newDimension <= 762:
		return 500
	else:
		return 1024
# sys for input 
# resize: if required is smaller- find min and resize. 
# return original 
# line 16 & 36&38. line doesnt exist. terminate program
# requried sizing :100 200 500 1024. return the closet one

generateNew(image_name, width, height, currDimension)





