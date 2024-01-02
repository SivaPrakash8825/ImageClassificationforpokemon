import React, { useState } from "react";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import { GetFirebase } from "../firebase";
import { View, Text, Image } from "react-native";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";

const Home = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const FindClass = () => {
    axios
      .post(
        `http://192.168.72.164:5000/submit`,
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
      allowsEditing: false,
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
      <View className=" relative  mb-6 w-56 h-16">
        <Image
          className="absolute w-full h-full"
          source={require("../assets/pokemonText.png")}></Image>
      </View>
      {loading ? (
        <View className="w-full h-[120vh] z-10 absolute flex justify-center items-center top-0">
          <ActivityIndicator size={"large"} />
          <View className="w-full h-full bg-red-300 opacity-[0.4] absolute -z-10"></View>
        </View>
      ) : (
        ""
      )}
      {image && (
        <Image
          className="rounded-2xl mb-5"
          source={{ uri: image }}
          style={{ width: 200, height: 200 }}
        />
      )}
      <View className="w-screen justify-around flex-row">
        <TouchableOpacity
          onPress={() => {
            // alert("fasdf");
            pickImage();
          }}>
          <Icon name="images" size={35} color={"white"}></Icon>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            alert("camera");
            // LaunchCamera();
          }}>
          <Icon name="camera" size={35} color={"white"}></Icon>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => {
          image ? FindClass() : null;
        }}>
        <Text
          className={` text-white rounded-md mt-6 py-3 px-5 ${
            image ? "bg-green-600 " : "bg-red-800"
          } `}>
          predict
        </Text>
      </TouchableOpacity>
      <Text className=" font-extrabold text-lg mt-6 text-white">
        Name of this pokemon : {name}
      </Text>
    </View>
  );
};

export default Home;
