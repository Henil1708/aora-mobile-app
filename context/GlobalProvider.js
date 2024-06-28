import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, getLikedPosts } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [likedVideos, setLikedVideos] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setIsLoggedIn(true);
          setUser(currentUser);
          const likedVideoData = await getLikedPosts(currentUser.$id);
          console.log(likedVideoData);
          setLikedVideos(likedVideoData);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
        likedVideos,
        setLikedVideos,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
