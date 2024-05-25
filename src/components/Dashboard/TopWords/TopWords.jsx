import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import AccessibilityModule from "highcharts/modules/accessibility";

import { useData } from "../../../context/DataContext";

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
      },
      title: {
        text:
          wordFilter === "comments"
            ? "Top Words in Comments"
            : "Top Words in Posts",
      },
      xAxis: {
        categories: wordData.map((item) => item.word),
      },
      yAxis: {
        title: {
          text: "Frequency",
        },
      },
      series: [
        {
          name: "Words",
          data: wordData.map((item) => item.count),
        },
      ],
    };
  }, [wordFilter, wordData]);

  return (
    <div>
      <div className="filters">
        <button onClick={() => setWordFilter("comments")}>
          Top Words in Comments
        </button>
        <button onClick={() => setWordFilter("posts")}>
          Top Words in Posts
        </button>
      </div>
      <HighchartsReact highcharts={Highcharts} options={wordChartOptions} />
    </div>
  );
};

export default TopWords;
