import tensorflow as tf
from tensorflow.keras import datasets, layers, models
import matplotlib.pyplot as plt
import numpy as np
(X_train,y_train),(X_test,y_test) = datasets.cifar10.load_data()
# print(X_train)
y_train = y_train.reshape(-1,)
y_test = y_test.reshape(-1,)
classes = ["airplane","automobile","bird","cat","deer","dog","frog","horse","ship","truck"]
def plot_sample(X, y, index):
    plt.figure(figsize = (15,2))
    plt.imshow(X[index])
    plt.xlabel(classes[y[index]])
    plt.show()

X_train = X_train / 255.0
X_test = X_test / 255.0

cnn = models.Sequential([
    layers.Conv2D(filters=32, kernel_size=(3, 3), activation='relu', input_shape=(32, 32, 3)),
    layers.MaxPooling2D((2, 2)),
    
    layers.Conv2D(filters=64, kernel_size=(3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dense(10, activation='softmax')
])
# print(X_test[2])
cnn.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])
# plt.imshow(X_test[3])
# plt.show()
cnn.fit(X_train, y_train, epochs=1)
y_pred = cnn.predict(X_test[2].reshape(1,32,32,3))
print(y_pred)
y_classes = [np.argmax(element) for element in y_pred]
plot_sample(X_train, y_train, y_classes[0])
print(y_classes)
# y_classes = [np.argmax(element) for element in y_pred]
