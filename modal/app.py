from flask import Flask, request,jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
import tensorflow as tf

import cv2

import numpy as np
from matplotlib import pyplot as plt
from keras.models import load_model
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

            
            return jsonify(predicted=classname[y_classes[0]])
    else:
        return 'No JSON data found in the request'



# import cv2

# Read the downloaded image


if __name__ == '__main__':
    app.run(debug=True)