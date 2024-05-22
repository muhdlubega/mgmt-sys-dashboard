import React from "react";
import "./Homepage.scss";
import homepage from "../../assets/homepage.jpg";
import { SearchBar } from "../../components";

const Homepage = () => {
  return (
    <div className="homepage">
      <img
        className="homepage-background"
        src={homepage}
        alt="homepage-background"
      />
      <div className="homepage-content">
        <h1>Management System Dashboard</h1>
      </div>
      <SearchBar />
    </div>
  );
};

export default Homepage;
