import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

import { useData } from "../../context/DataContext";

import "./SearchBar.scss";

const SearchBar = () => {
  const { users, posts } = useData();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const clearSearch = () => {
    setQuery("");
  };

  const filteredResults = useMemo(() => {
    if (query.length > 2) {
      const filteredUsers = users.filter(
        (user) =>
          user.name?.toLowerCase().includes(query.toLowerCase()) ||
          user.username?.toLowerCase().includes(query.toLowerCase()) ||
          user.email?.toLowerCase().includes(query.toLowerCase())
      );

      const filteredPosts = posts.filter(
        (post) =>
          post.title?.toLowerCase().includes(query.toLowerCase()) ||
          post.body?.toLowerCase().includes(query.toLowerCase())
      );

      return [...filteredUsers, ...filteredPosts];
    }
    return [];
  }, [query, users, posts]);

  const renderResults = () => {
    return filteredResults.map((result) => {
      if (result.title) {
        return (
          <Link
            to={`/post/${result.id}`}
            key={result.id}
            className="search-result"
            onClick={clearSearch}
          >
            <p>
              <strong>Post:</strong> {result.title}
            </p>
            <p>{result.body}</p>
          </Link>
        );
      } else {
        return (
          <Link
            to={`/user/${result.id}`}
            key={result.id}
            className="search-result"
            onClick={clearSearch}
          >
            <p>
              <strong>User:</strong>{" "}
              {result.name || result.email?.split("@")[0]}
            </p>
            <p>({result.email})</p>
          </Link>
        );
      }
    });
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search users or posts..."
        value={query}
        onChange={handleSearch}
      />
      <div className="search-results">{renderResults()}</div>
    </div>
  );
};

export default SearchBar;
