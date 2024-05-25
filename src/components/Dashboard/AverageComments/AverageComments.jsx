import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import AccessibilityModule from "highcharts/modules/accessibility";

import { useData } from "../../../context/DataContext";

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

  return (
    <div>
      <div className="filters">
        <button onClick={() => setFilter("posts")}>
          Average Comments Per Post
        </button>
        <button onClick={() => setFilter("users")}>
          Average Comments Per User
        </button>
      </div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default AverageComments;
