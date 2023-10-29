import tensorflow as tf
import os
import cv2
import imghdr
import numpy as np
from matplotlib import pyplot as plt
data_dir = "./data/pokemon"
image_exts = ['jpeg','jpg', 'bmp', 'png']
print(os.listdir(data_dir))
for image_class in os.listdir(data_dir): 
    for image in os.listdir(os.path.join(data_dir, image_class)):
        image_path = os.path.join(data_dir, image_class, image)
        try: 
            img = cv2.imread(image_path)
            tip = imghdr.what(image_path)
            if tip not in image_exts: 
                print('Image not in ext list {}'.format(image_path))
                os.remove(image_path)
        except Exception as e: 
            print('Issue with image {}'.format(image_path))
            # os.remove(image_path)
data = tf.keras.utils.image_dataset_from_directory('./data/pokemon')
data_iterator = data.as_numpy_iterator()
batch = data_iterator.next()

fig, ax = plt.subplots(ncols=4, figsize=(20,20))
for idx, img in enumerate(batch[0][:4]):
   
    ax[idx].imshow(img.astype(int))
    ax[idx].title.set_text(batch[1][idx])
plt.show()
data = data.map(lambda x,y: (x/255, y))
data.as_numpy_iterator().next()

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Dense, Flatten, Dropout
train_size = int(len(data)*.9)
val_size = int(len(data)*.1)
test_size = int(len(data)*.1)
train = data.take(train_size)
val = data.skip(train_size).take(val_size)
test = data.skip(train_size+val_size).take(test_size)
model = Sequential()
model.add(Conv2D(16, (3,3), 1, activation='relu', input_shape=(256,256,3)))
model.add(MaxPooling2D())
model.add(Conv2D(32, (3,3), 1, activation='relu'))
model.add(MaxPooling2D())
model.add(Conv2D(16, (3,3), 1, activation='relu'))
model.add(MaxPooling2D())
model.add(Flatten())
model.add(Dense(256, activation='relu'))
model.add(Dense(143, activation='sigmoid'))
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])
hist = model.fit(train, epochs=5, validation_data=val)
import cv2
img = cv2.imread('./00000159.jpg')
resize = tf.image.resize(img, (256,256))
resize = tf.image.resize(img, (256,256))
plt.imshow(resize.numpy().astype(int))
# plt.imshow(batch[0][15].astype(int))
plt.show()
# yhat = model.predict(batch[0][15].astype(int).reshape(1,256, 256, 3))
yhat = model.predict(np.expand_dims(resize/255, 0))
y_classes = [np.argmax(element) for element in yhat]

