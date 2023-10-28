from flask import Flask, request

app = Flask(__name__)
import tensorflow as tf
import os
import cv2
import imghdr
import numpy as np
from matplotlib import pyplot as plt
from tensorflow.keras.models import load_model
new_model = load_model('./modal/imageclassifier.h5')
import requests


@app.route('/submit', methods=['POST'])
def post_request_data():
    if request.is_json:
        data = request.get_json()
        url = data.get('url')# Extract the 'name' field
        if url is not None:
            
            response = requests.get(url)
            if response.status_code == 200:
                with open("downloaded_image.jpg", 'wb') as f:
                    f.write(response.content)
                
            else:
                print("Failed to download the image")
                exit()
            img = cv2.imread("./downloaded_image.jpg")
            resize = tf.image.resize(img, (256,256))
            resize = tf.image.resize(img, (256,256))
            plt.imshow(resize.numpy().astype(int))
            yhat=new_model.predict(np.expand_dims(resize/255, 0))
            y_classes = [np.argmax(element) for element in yhat]
            classname=['Arbok', 'Arcanine', 'Beedrill', 'Charizard', 'Charmeleon', 'Rhyhorn', 'Snorlax', 'Tentacruel', 'Vaporeon', 'Weedle', 'Weepinbell', 'Weezing', 'Wigglytuff', 'Zapdos']

            
            return f'Name Received: {classname[y_classes[0]]}'
    else:
        return 'No JSON data found in the request'



# import cv2

# Read the downloaded image


if __name__ == '__main__':
    app.run()