import {
  Text,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import FormField from "@/components/FormField";
import { ResizeMode, Video } from "expo-av";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { createVideo } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const Create = () => {
  const [uploading, setUploading] = useState(false);
  const { user } = useGlobalContext();
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });

  const submit = async () => {
    if (!form.prompt || !form.thumbnail || !form.title || !form.video) {
      return Alert.alert("Please fill in all the fields");
    }

    setUploading(true);

    try {
      await createVideo({
        ...form,
        userId: user.$id,
      });

      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert(
        "Opps something went wrong while uploading the data",
        error.message
      );
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });
      setUploading(false);
    }
  };

  const openPicker = async (selectType) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm((prev) => ({ ...prev, thumbnail: result.assets[0] }));
      } else {
        setForm((prev) => ({ ...prev, video: result.assets[0] }));
      }
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6 mt-12">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View className="flex flex-row items-center justify-between ">
            <Text className="text-2xl font-psemibold text-white">
              Upload Video
            </Text>
          </View>
          <FormField
            title={"Video Title"}
            value={form.title}
            placeholder={"Give your video a catch title..."}
            handleChangeText={(e) => setForm({ ...form, title: e })}
            otherStyles={"mt-10"}
          />

          <View className="mt-7 space-y-2">
            <Text className="text-base font-pmedium text-gray-100">
              Upload Video
            </Text>

            <TouchableOpacity onPress={() => openPicker("video")}>
              {form.video ? (
                <Video
                  source={{ uri: form.video.uri ? form.video.uri : form.video }}
                  resizeMode={ResizeMode.COVER}
                  className="w-full h-64 rounded-2xl"
                />
              ) : (
                <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                  <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center rounded-xl">
                    <Image
                      source={icons.upload}
                      resizeMode="contain"
                      className="w-1/2 h-1/2"
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View className="mt-7 space-y-2">
            <Text className="text-base font-pmedium text-gray-100">
              Thumbnail Image
            </Text>
            <TouchableOpacity onPress={() => openPicker("image")}>
              {form.thumbnail ? (
                <Image
                  source={{
                    uri: form.thumbnail.uri
                      ? form.thumbnail.uri
                      : form.thumbnail,
                  }}
                  resizeMode="cover"
                  className="w-full h-64 rounded-2xl"
                />
              ) : (
                <View
                  className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200
               space-x-2"
                >
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-5 h-5"
                  />
                  <Text className="text-sm text-gray-100 font-pmedium">
                    Choose a file
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <FormField
            title={"AI Prompt"}
            value={form.prompt}
            placeholder={"The prompt you used to create this video..."}
            handleChangeText={(e) => setForm({ ...form, prompt: e })}
            otherStyles={"mt-7"}
          />

          <CustomButton
            containerStyles={"mt-7"}
            title={"Submit & Publish"}
            handlePress={submit}
            isLoading={uploading}
          />
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
