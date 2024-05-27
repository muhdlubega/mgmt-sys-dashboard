import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import AccessibilityModule from "highcharts/modules/accessibility";

import { useData } from "../../../context/DataContext";

import "./AverageComments.scss";

const AverageComments = () => {
  AccessibilityModule(Highcharts);
  const { getAverageCommentsPerPost, getAverageCommentsPerUser } = useData();
  const [filter, setFilter] = useState("users");

  const data = useMemo(() => {
    if (filter === "posts") {
      return getAverageCommentsPerPost();
    } else {
      return getAverageCommentsPerUser();
    }
  }, [filter, getAverageCommentsPerPost, getAverageCommentsPerUser]);

  const chartOptions = useMemo(() => {
    return {
      chart: {
        backgroundColor: "#2a2e34",
        height: 370,
      },
      title: {
        text:
          filter === "posts"
            ? "Average Comments Per Post"
            : "Average Comments Per User",
        style: {
          color: "#616b78",
        },
      },
      xAxis: {
        categories: data.map((item) =>
          filter === "posts" ? item.title : item.name
        ),
        labels: {
          style: {
            color: "#616b78",
          },
        },
      },
      yAxis: {
        title: {
          text: "Average Comments",
        },
        gridLineColor: "#616b78",
        labels: {
          style: {
            color: "#616b78",
          },
        },
      },
      plotOptions: {
        bar: {
          borderColor: "#616b78",
        },
      },
      legend: {
        itemStyle: {
          color: "#616b78",
        },
        itemHoverStyle: {
          color: "#fff",
        },
        itemHiddenStyle: {
          color: "#616b78",
        },
      },
      series: [
        {
          name: "Average Comments",
          data: data.map((item) => item.averageComments),
        },
      ],
      credits: {
        enabled: false,
      },
    };
  }, [filter, data]);

  return (
    <div className="average-comments">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      <div className="average-comments__filters">
        <button
          className={`average-comments__filters-button ${
            filter === "posts" ? "active" : ""
          }`}
          onClick={() => setFilter("posts")}
        >
          Post
        </button>
        <button
          className={`average-comments__filters-button ${
            filter === "users" ? "active" : ""
          }`}
          onClick={() => setFilter("users")}
        >
          User
        </button>
      </div>
    </div>
  );
};

export default AverageComments;
