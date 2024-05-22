import React, { useState, useMemo } from "react";
import "./Posts.scss";
import { useData } from "../../context/DataContext";
import { Loader, Post } from "../../components";

const POSTS_PER_PAGE = 10;

const Posts = () => {
  const { comments, posts, loading, users } = useData();
  const [selectedUser, setSelectedUser] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
    setCurrentPage(1);
  };

  const filteredPosts = useMemo(() => {
    if (selectedUser === "all") {
      return posts;
    }
    return posts.filter((post) => post.userId === parseInt(selectedUser, 10));
  }, [selectedUser, posts]);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [currentPage, filteredPosts]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  }, [filteredPosts]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="posts">
      <div className="filter-container">
        <label htmlFor="userFilter">Filter by User:</label>
        <select
          id="userFilter"
          value={selectedUser}
          onChange={handleUserChange}
        >
          <option value="all">All Users</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <div className="posts-list">
        {paginatedPosts.map((post, index) => (
          <Post key={index} comments={comments} post={post} users={users} />
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Posts;
