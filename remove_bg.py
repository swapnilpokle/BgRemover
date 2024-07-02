import sys
import os
from rembg import remove
import cv2

input_path = sys.argv[1]
output_path = input_path.replace('uploads', 'processed') + '.png'

# Create the 'processed' directory if it does not exist
os.makedirs(os.path.dirname(output_path), exist_ok=True)

input_image = cv2.imread(input_path)
output_image = remove(input_image)

cv2.imwrite(output_path, output_image)

with open(output_path, 'rb') as f:
    sys.stdout.buffer.write(f.read())
