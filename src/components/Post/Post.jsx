import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Post.scss";
import { RandomAvatar } from "react-random-avatars";
import { LiaCommentSolid } from "react-icons/lia";

const Post = ({ post, users, comments }) => {
  const [showComments, setShowComments] = useState(false);
  const user = users.find((user) => user.id === post.userId);
  const postComments = comments.filter((comment) => comment.postId === post.id);

  return (
    <div>
      <Link to={`/post/${post.id}`} className="post" key={post.id}>
        {user && (
          <div className="post-user">
            <RandomAvatar
              name={user.name || user.email?.split("@")[0]}
              size={window.innerWidth < 768 ? 40 : 60}
            />
          </div>
        )}
        <div className="post-details">
          {user && <h3>{user.name || user.email}</h3>}
          <h4>{post.title}</h4>
          <p>{post.body}</p>

          {showComments && (
            <div className="post-commentbox">
              <h3>Top comments:</h3>
              {postComments.length > 0 ? (
                // If show comments button is clicked only the top two comments in the array is displayed
                postComments.slice(3).map((comment) => (
                  <div className="post-comments" key={comment.id}>
                    <h3>{comment.email}</h3>
                    <h4>{comment.name}</h4>
                    <p>{comment.body}</p>
                  </div>
                ))
              ) : (
                <h3>No comments found.</h3>
              )}
              <h5>See more...</h5>
            </div>
          )}
        </div>
      </Link>
      <button
        className="show-comments-button"
        onClick={() => setShowComments(!showComments)}
      >
        <LiaCommentSolid size={30} />
        <p>Show comments</p>
      </button>
    </div>
  );
};

export default Post;
