import React, { useState, useMemo, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useData } from "../../context/DataContext";

import "./SearchBar.scss";

const SearchBar = ({ isOpen, setIsOpen }) => {
  const { users, posts } = useData();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef(null);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const clearSearch = () => {
    setQuery("");
    setIsFocused(false);
  };

  // Filters out from post and user parameters when input is more than 2 characters
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
          </Link>
        );
      }
    });
  };

  // When clicked outside of the search result container input is emptied and container is closed
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setIsFocused(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);

  return (
    <div className="search-bar" ref={searchInputRef}>
      {isOpen ? (
        <React.Fragment>
          <input
            className="search-bar__input"
            type="text"
            placeholder="Search users or posts..."
            value={query}
            onChange={handleSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {(isFocused || query.length > 2) && (
            <div className="search-results">{renderResults()}</div>
          )}
        </React.Fragment>
      ) : (
        <FaSearch
          className="search-bar__icon"
          size={24}
          onClick={() => setIsOpen(true)}
        />
      )}
    </div>
  );
};

export default SearchBar;
