import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import { getLikedPosts } from "@/lib/appwrite";
import useAppWrite from "@/hooks/useAppWrite";
import VideoCard from "@/components/VideoCard";
import { useGlobalContext } from "@/context/GlobalProvider";

const Bookmark = () => {
  const { user, likedVideos, isLoading, setLikedVideos } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);

  const getPosts = async () => {
    try {
      const posts = await getLikedPosts(user.$id);

      setLikedVideos(posts);
    } catch (error) {
      Alert.alert("Ops something went wrong Bookmark", error.message);
    }
  };

  useEffect(() => {
    getPosts();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getPosts();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={likedVideos.documents || []}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="w-full  mt-12 mb-12 px-4">
            <Text className="text-white text-2xl font-bold">Bookmarks</Text>
            <View className="flex-row items-center justify-between mt-4">
              <Text className="text-white text-lg">Liked videos</Text>
              <Text className="text-gray-100 text-xl">
                {likedVideos?.documents?.length}
              </Text>
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <>
            {!isLoading && (
              <EmptyState
                title="No liked video found"
                subTitle="Just like a video to keep for future use"
                hideButton={true}
              />
            )}
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Bookmark;
