import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Post.scss";

const Post = ({ post, users, comments }) => {
  const [showComments, setShowComments] = useState(false);
  const user = users.find((user) => user.id === post.userId);
  const postComments = comments.filter((comment) => comment.postId === post.id);

  return (
    <div className="post" key={post.id}>
      <Link to={`/post/${post.id}`}>
        <h4>{post.title}</h4>
      </Link>
      <Link to={`/post/${post.id}`}>
        <p>{post.body}</p>
      </Link>
      {user && (
        <div className="post-user">
          <h3>Posted by:</h3>
          <div>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <p>{user.username}</p>
          </div>
        </div>
      )}
      <button onClick={() => setShowComments(!showComments)}>
        Show Comments
      </button>
      {showComments && (
        <div className="post-comments">
          <h3>Comments:</h3>
          {postComments.length > 0 ? (
            postComments.slice(3).map((comment) => (
              <div key={comment.id}>
                <p>{comment.name}</p>
                <p>{comment.email}</p>
                <p>{comment.body}</p>
              </div>
            ))
          ) : (
            <p>No comments found.</p>
          )}
          <Link to={`/post/${post.id}`}>
            <p>See more...</p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Post;
