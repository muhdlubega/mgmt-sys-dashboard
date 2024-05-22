import React, { useState, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useData } from "../../context/DataContext";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Dashboard.scss";
import { HeatmapLayer } from "../../components";
import HighchartsAccessibility from "highcharts/modules/accessibility";

HighchartsAccessibility(Highcharts);

const Dashboard = () => {
  const {
    getAverageCommentsPerPost,
    getAverageCommentsPerUser,
    getTopWordsFromComments,
    getTopWordsFromPosts,
    getCompletedTodos,
    users,
  } = useData();
  const [filter, setFilter] = useState("posts");

  const data = useMemo(() => {
    if (filter === "posts") {
      return getAverageCommentsPerPost();
    } else {
      return getAverageCommentsPerUser();
    }
  }, [filter, getAverageCommentsPerPost, getAverageCommentsPerUser]);

  const chartOptions = useMemo(() => {
    return {
      title: {
        text:
          filter === "posts"
            ? "Average Comments Per Post"
            : "Average Comments Per User",
      },
      xAxis: {
        categories: data.map((item) =>
          filter === "posts" ? item.title : item.name
        ),
      },
      yAxis: {
        title: {
          text: "Average Comments",
        },
      },
      series: [
        {
          name: "Average Comments",
          data: data.map((item) => item.averageComments),
        },
      ],
    };
  }, [filter, data]);

  const heatmapData = useMemo(() => {
    return users.map((user) => ({
      lat: parseFloat(user.address.geo.lat),
      lng: parseFloat(user.address.geo.lng),
      value: 1,
    }));
  }, [users]);

  const topWordsFromComments = useMemo(() => {
    return getTopWordsFromComments();
  }, [getTopWordsFromComments]);

  const topWordsFromPosts = useMemo(() => {
    return getTopWordsFromPosts();
  }, [getTopWordsFromPosts]);

  const commentsWordChartOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
      },
      title: {
        text: "Top Words in Comments",
      },
      xAxis: {
        categories: topWordsFromComments.map((item) => item.word),
      },
      yAxis: {
        title: {
          text: "Frequency",
        },
      },
      series: [
        {
          name: "Words",
          data: topWordsFromComments.map((item) => item.count),
        },
      ],
    }),
    [topWordsFromComments]
  );

  const postsWordChartOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
      },
      title: {
        text: "Top Words in Posts",
      },
      xAxis: {
        categories: topWordsFromPosts.map((item) => item.word),
      },
      yAxis: {
        title: {
          text: "Frequency",
        },
      },
      series: [
        {
          name: "Words",
          data: topWordsFromPosts.map((item) => item.count),
        },
      ],
    }),
    [topWordsFromPosts]
  );

  const completedTodosData = useMemo(() => {
    return getCompletedTodos();
  }, [getCompletedTodos]);

  const mostCompletedTodosChartOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
      },
      title: {
        text: "Users with Most Completed Todos",
      },
      xAxis: {
        categories: completedTodosData.mostCompleted.map((item) => item.name),
      },
      yAxis: {
        title: {
          text: "Number of Completed Todos",
        },
      },
      series: [
        {
          name: "Completed Todos",
          data: completedTodosData.mostCompleted.map(
            (item) => item.completedTodos
          ),
        },
      ],
    }),
    [completedTodosData]
  );

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="filters">
        <button onClick={() => setFilter("posts")}>
          Average Comments Per Post
        </button>
        <button onClick={() => setFilter("users")}>
          Average Comments Per User
        </button>
      </div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      <HighchartsReact
        highcharts={Highcharts}
        options={commentsWordChartOptions}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={postsWordChartOptions}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={mostCompletedTodosChartOptions}
      />
      <h2>User Location Heatmap</h2>
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url={process.env.REACT_APP_MAP_URL} />
        <HeatmapLayer points={heatmapData} />
      </MapContainer>
    </div>
  );
};

export default Dashboard;
