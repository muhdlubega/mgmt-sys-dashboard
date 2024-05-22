import React from "react";
import { useParams } from "react-router-dom";
import "./PostDetails.scss";
import { useData } from "../../context/DataContext";
import { RandomAvatar } from "react-random-avatars";
import { Error404 } from "../Error404";
import { Loader } from "../../components";

const PostDetails = () => {
  const { id } = useParams();
  const { comments, loading, posts, users } = useData();
  const postId = parseInt(id, 10);

  const post = posts.find((post) => post.id === postId);
  const user = post ? users.find((user) => user.id === post.userId) : null;
  const postComments = comments.filter((comment) => comment.postId === postId);

  if (loading) {
    return <Loader />;
  }

  if (!post) {
    return <Error404 />;
  }

  return (
    <div className="post-details">
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      {user && (
        <div className="user-details">
          <h2>User Details</h2>
          <RandomAvatar name={user.name} size={96} />
          <p>Name: {user.name}</p>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          <p>Website: {user.website}</p>
          <p>Company: {user.company.name}</p>
          <p>
            Address: {user.address.street}, {user.address.city}
          </p>
        </div>
      )}
      <div className="user-comments">
        <h3>Comments:</h3>
        {postComments.length > 0 ? (
          postComments.map((comment) => (
            <div className="user-comments-content" key={comment.id}>
              <p>{comment.name}</p>
              <p>{comment.email}</p>
              <p>{comment.body}</p>
            </div>
          ))
        ) : (
          <p>No comments found.</p>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
