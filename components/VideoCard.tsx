import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { icons } from "@/constants";
import { ResizeMode, Video } from "expo-av";
import { useGlobalContext } from "@/context/GlobalProvider";
import { likePost } from "@/lib/appwrite";

const VideoCard = ({
  video: { $id, title, thumbnail, video, creator, prompt },
}) => {
  const [play, setPlay] = useState(false);
  const { likedVideos, setLikedVideos } = useGlobalContext();

  const handleLike = async (userId, videoId) => {
    try {
      const likedPost = await likePost(userId, videoId);
      console.log("likedPost", likedPost);
      likedPost.likedPostsMap[likedPost.videoId.$id] = likedPost;

      setLikedVideos({
        documents: [...likedVideos.documents, likedPost],
        likedVideosMap: likedPost.likedPostsMap,
      });
    } catch (error) {
      Alert.alert("Ops something went wrong", error.message);
    }
  };

  const handleUnLike = async (userId, videoId) => {
    try {
      const likedPost = await likePost(userId, videoId);
      delete likedPost.likedPostsMap[likePost.videoId.$id];

      setLikedVideos({
        documents: [...likedVideos.documents, likedPost],
        likedVideosMap: likedPost.likedPostsMap,
      });
    } catch (error) {
      Alert.alert("Ops something went wrong", error.message);
    }
  };

  useEffect(() => {
    console.log("FROM VIDEO CARD", video);
  }, [likedVideos]);

  return (
    <View className="flex-col items-center px-4 mb-14">
      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3 "
          resizeMode={ResizeMode.COVER}
          useNativeControls
          shouldPlay
          onError={(error) => {
            Alert.alert("Ops, Something went wrong with video", error.message);
            setPlay(false);
          }}
          onLoad={(status) => console.log("Video Loaded:", status)}
          onLoadStart={() => console.log("Video Load Start")}
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
      <View className="flex-row gap-3 items-start mt-3">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: creator?.avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {creator?.username}
            </Text>
          </View>
        </View>
        {$id && likedVideos?.likedPostsMap[$id] ? (
          <TouchableOpacity
            className="pt-2"
            onPress={() => handleUnLike(creator?.$id || "", $id)}
          >
            <Image
              source={icons.heartFilled}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="pt-2"
            onPress={() => handleLike(creator?.$id || "", $id)}
          >
            <Image
              source={icons.heartOutlined}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default VideoCard;
