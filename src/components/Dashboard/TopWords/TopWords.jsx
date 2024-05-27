import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import AccessibilityModule from "highcharts/modules/accessibility";

import { useData } from "../../../context/DataContext";

import "./TopWords.scss";

const TopWords = () => {
  AccessibilityModule(Highcharts);
  const { getTopWordsFromComments, getTopWordsFromPosts } = useData();
  const [wordFilter, setWordFilter] = useState("comments");

  const topWordsFromComments = useMemo(() => {
    return getTopWordsFromComments();
  }, [getTopWordsFromComments]);

  const topWordsFromPosts = useMemo(() => {
    return getTopWordsFromPosts();
  }, [getTopWordsFromPosts]);

  const wordData = useMemo(() => {
    if (wordFilter === "comments") {
      return topWordsFromComments;
    } else {
      return topWordsFromPosts;
    }
  }, [wordFilter, topWordsFromComments, topWordsFromPosts]);

  const wordChartOptions = useMemo(() => {
    return {
      chart: {
        type: "bar",
        height: 370,
        backgroundColor: "#2a2e34",
      },
      title: {
        text:
          wordFilter === "comments"
            ? "Top Words in Comments"
            : "Top Words in Posts",
        style: {
          color: "#616b78",
        },
      },
      xAxis: {
        categories: wordData.map((item) => item.word),
        labels: {
          style: {
            color: "#616b78",
          },
        },
      },
      yAxis: {
        title: {
          text: "Frequency",
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
          name: "Words",
          data: wordData.map((item) => item.count),
        },
      ],
      credits: {
        enabled: false,
      },
    };
  }, [wordFilter, wordData]);

  return (
    <div className="top-words">
      <HighchartsReact highcharts={Highcharts} options={wordChartOptions} />
      <div className="top-words__filters">
        <button
          className={`top-words__filters-button ${
            wordFilter === "comments" ? "active" : ""
          }`}
          onClick={() => setWordFilter("comments")}
        >
          Comments
        </button>
        <button
          className={`top-words__filters-button ${
            wordFilter === "posts" ? "active" : ""
          }`}
          onClick={() => setWordFilter("posts")}
        >
          Posts
        </button>
      </div>
    </div>
  );
};

export default TopWords;
