import { View, Text, SafeAreaView, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";
import { searchPosts } from "@/lib/appwrite";
import useAppWrite from "@/hooks/useAppWrite";
import VideoCard from "@/components/VideoCard";
import { useLocalSearchParams } from "expo-router";

const Search = () => {
  const { query } = useLocalSearchParams();
  const {
    data: posts,
    isLoading,
    refetchData,
  } = useAppWrite(() => searchPosts(query));

  useEffect(() => {
    refetchData();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-gray-100">
              Search Results
            </Text>
            <Text className="text-2xl font-psemibold text-white">{query}</Text>
            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query} />
            </View>

            {isLoading && (
              <EmptyState
                title="Searching..."
                subTitle={`Searching for your request for ${query}`}
                hideButton
              />
            )}
          </View>
        )}
        ListEmptyComponent={() => (
          <>
            {!isLoading && (
              <EmptyState
                title="No Videos Found"
                subTitle="No videos found for this search"
              />
            )}
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
