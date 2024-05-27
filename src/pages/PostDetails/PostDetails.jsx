import React, { useEffect } from "react";
import { RandomAvatar } from "react-random-avatars";
import { useNavigate, useParams } from "react-router-dom";
import { RiArrowGoBackFill } from "react-icons/ri";

import { Loader } from "../../components";
import { useData } from "../../context/DataContext";
import { Error404 } from "../Error404";

import "./PostDetails.scss";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { comments, loading, posts, users } = useData();
  const postId = parseInt(id, 10);

  const post = posts.find((post) => post.id === postId);
  const user = post ? users.find((user) => user.id === post.userId) : null;
  const postComments = comments.filter((comment) => comment.postId === postId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return <Loader />;
  }

  if (!post) {
    return <Error404 />;
  }

  return (
    <div className="post-details">
      {user && (
        <div className="post-details-user">
          <div className="post-details-user__icon">
            <RandomAvatar
              name={user.name || user.email?.split("@")[0]}
              size={96}
            />
            <button onClick={handleBackClick} className="back-button">
              <RiArrowGoBackFill /> Back
            </button>
          </div>
          <div className="post-details-user__text">
            <h1>{user.name || user.email?.split("@")[0]}</h1>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        </div>
      )}
      <div className="post-details-comment">
        <h2>{post.title}</h2>
        <p>{post.body}</p>
      </div>
      <div className="user-comments">
        <h3>Comments:</h3>
        {postComments.length > 0 ? (
          postComments.map((comment) => (
            <div className="user-comments-content" key={comment.id}>
              <h4>{comment.email}</h4>
              <h3>{comment.name}</h3>
              <p>{comment.body}</p>
            </div>
          ))
        ) : (
          <h3>No comments found.</h3>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
