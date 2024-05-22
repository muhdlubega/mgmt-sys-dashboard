import React, { useState } from "react";
import "./Post.scss";
import { Link } from "react-router-dom";

const Post = ({ post, users, comments }) => {
  const [showComments, setShowComments] = useState(false);
  const user = users.find((user) => user.id === post.userId);
  const postComments = comments.filter((comment) => comment.postId === post.id);

  return (
    <Link to={`/post/${post.id}`} className="post" key={post.id}>
      <p>{post.title}</p>

      <p>{post.body}</p>
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
            postComments.map((comment) => (
              <div key={comment.id}>
                <p>{comment.name}</p>
                <p>{comment.email}</p>
                <p>{comment.body}</p>
              </div>
            ))
          ) : (
            <p>No comments found.</p>
          )}
        </div>
      )}
    </Link>
  );
};

export default Post;
