import React, { useState } from "react";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import { GetFirebase } from "../firebase";
import { View, Text, Image } from "react-native";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const Home = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const FindClass = () => {
    axios
      .post(
        `http://192.168.50.164:5000/submit`,
        {
          url: image,
        },
        {
          headers: {
            "Content-Type": "application/json", // Set the appropriate content type
          },
        }
      )
      .then((resp) => {
        console.log(resp.data.predicted);
        setName(resp.data.predicted);
      })
      .catch((error) => {
        console.error("Network error:", error);
      });
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      setLoading(true);

      const storage = getStorage();
      const reference = ref(
        storage,
        `${Math.random() * 200}/${result.assets[0].uri.split("/").pop()}`
      );

      // Read the image file as a Blob
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();

      // Upload the image using the put method with the Blob
      uploadBytes(reference, blob)
        .then((snapshot) => {
          getDownloadURL(reference).then((downloadURL) => {
            console.log("File available at", downloadURL);
            setImage(downloadURL);
            setLoading(false);
          });
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    }
  };

  return (
    <View className=" flex-1 justify-center items-center bg-gray-800 w-screen h-screen">
      {loading ? (
        <View className="w-full h-[120vh] z-10 absolute flex justify-center items-center top-0">
          <ActivityIndicator size={"large"} />
          <View className="w-full h-full bg-red-300 opacity-[0.4] absolute -z-10"></View>
        </View>
      ) : (
        ""
      )}
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      <View className="w-screen justify-around flex-row">
        <TouchableOpacity
          onPress={() => {
            // alert("fasdf");
            pickImage();
          }}>
          <Text className=" text-white">gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            alert("camera");
            // LaunchCamera();
          }}>
          <Text className=" text-white">camera</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => {
          image ? FindClass() : null;
        }}>
        <Text className={`${image ? "text-red-600" : "text-green-800"} `}>
          predict
        </Text>
      </TouchableOpacity>
      <Text className=" text-red-600">output : {name}</Text>
    </View>
  );
};

export default Home;
