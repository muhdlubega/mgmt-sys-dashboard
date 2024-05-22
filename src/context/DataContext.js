import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { removeStopwords } from "stopword";
import axios from "axios";

const CACHE_EXPIRATION_TIME = 1000 * 60 * 5;

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cacheTime, setCacheTime] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const currentTime = new Date().getTime();
      if (cacheTime && currentTime - cacheTime < CACHE_EXPIRATION_TIME) {
        setLoading(false);
        return;
      }

      const [usersResponse, postsResponse, commentsResponse, todosResponse] =
        await Promise.all([
          axios.get(`${process.env.REACT_APP_BASE_URL}/users`),
          axios.get(`${process.env.REACT_APP_BASE_URL}/posts`),
          axios.get(`${process.env.REACT_APP_BASE_URL}/comments`),
          axios.get(`${process.env.REACT_APP_BASE_URL}/todos`),
        ]);

      setUsers(usersResponse.data);
      setPosts(postsResponse.data);
      setComments(commentsResponse.data);
      setTodos(todosResponse.data);
      setCacheTime(currentTime);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [cacheTime]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getAverageCommentsPerPost = useCallback(() => {
    const postCommentCounts = posts.reduce((acc, post) => {
      acc[post.id] = comments.filter(
        (comment) => comment.postId === post.id
      ).length;
      return acc;
    }, {});

    const averages = posts.map((post) => ({
      postId: post.id,
      title: post.title,
      averageComments: postCommentCounts[post.id],
    }));

    return averages;
  }, [posts, comments]);

  const getAverageCommentsPerUser = useCallback(() => {
    const userCommentCounts = users.reduce((acc, user) => {
      const userPosts = posts.filter((post) => post.userId === user.id);
      const totalComments = userPosts.reduce(
        (sum, post) =>
          sum + comments.filter((comment) => comment.postId === post.id).length,
        0
      );
      acc[user.id] = totalComments / userPosts.length || 0;
      return acc;
    }, {});

    const averages = users.map((user) => ({
      userId: user.id,
      name: user.name,
      averageComments: userCommentCounts[user.id],
    }));

    return averages;
  }, [users, posts, comments]);

  const getTopWords = useCallback((texts, numWords = 10) => {
    const words = texts
      .flatMap((text) => text.split(/\s+/))
      .map((word) => word.toLowerCase().replace(/[^\w]/g, ""));

    const filteredWords = removeStopwords(words);

    const wordCounts = filteredWords.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    const sortedWords = Object.entries(wordCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, numWords)
      .map(([word, count]) => ({ word, count }));

    return sortedWords;
  }, []);

  const getTopWordsFromComments = useCallback(() => {
    const commentsText = comments.map((comment) => comment.body);
    return getTopWords(commentsText);
  }, [comments, getTopWords]);

  const getTopWordsFromPosts = useCallback(() => {
    const postsText = posts.map((post) => post.body);
    return getTopWords(postsText);
  }, [posts, getTopWords]);

  const getCompletedTodos = useCallback(() => {
    const userCompletedTodos = users.map((user) => {
      const userTodos = todos.filter((todo) => todo.userId === user.id);
      const completedTodos = userTodos.filter((todo) => todo.completed).length;
      return {
        userId: user.id,
        name: user.name,
        completedTodos,
      };
    });

    const sortedUsers = userCompletedTodos.sort(
      (a, b) => b.completedTodos - a.completedTodos
    );

    return {
      mostCompleted: sortedUsers.slice(0, 10),
      leastCompleted: sortedUsers.slice(-10).reverse(),
    };
  }, [users, todos]);

  const contextValue = useMemo(
    () => ({
      users,
      posts,
      comments,
      todos,
      loading,
      getAverageCommentsPerPost,
      getAverageCommentsPerUser,
      getTopWordsFromComments,
      getTopWordsFromPosts,
      getCompletedTodos,
    }),
    [
      users,
      posts,
      comments,
      todos,
      loading,
      getAverageCommentsPerPost,
      getAverageCommentsPerUser,
      getTopWordsFromComments,
      getTopWordsFromPosts,
      getCompletedTodos,
    ]
  );

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext);
};
