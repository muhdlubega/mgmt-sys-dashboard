import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import AccessibilityModule from "highcharts/modules/accessibility";

import { useData } from "../../../context/DataContext";

import "./MostCompletedTodos.scss";

const MostCompletedTodos = () => {
  AccessibilityModule(Highcharts);
  const { getCompletedTodos } = useData();

  const completedTodosData = useMemo(() => {
    return getCompletedTodos();
  }, [getCompletedTodos]);

  const mostCompletedTodosChartOptions = useMemo(() => {
    const data = completedTodosData.mostCompleted.map((item) => ({
      name: item.name,
      y: item.completedTodos,
    }));

    // Find the person with the most completed todos
    const maxCompletedIndex = data.reduce(
      (maxIdx, currentItem, idx, arr) =>
        currentItem.y > arr[maxIdx].y ? idx : maxIdx,
      0
    );

    // Add data labels only to the person with the most completed todos
    data[maxCompletedIndex] = {
      ...data[maxCompletedIndex],
      dataLabels: {
        enabled: true,
        format: "<b>{point.name}</b>: {point.percentage:.1f} %",
        style: {
          color: "#616b78",
          textOutline: "none",
        },
      },
    };

    return {
      chart: {
        type: "pie",
        backgroundColor: "#2a2e34",
      },
      title: {
        text: "Users with Most Completed Todos",
        style: {
          color: "#616b78",
        },
      },
      tooltip: {
        pointFormat:
          "{series.name}: <b>{point.y} ({point.percentage:.1f}%)</b>",
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          borderColor: "#616b78",
          dataLabels: {
            enabled: false,
          },
        },
      },
      series: [
        {
          name: "Completed Todos",
          colorByPoint: true,
          data,
        },
      ],
      credits: {
        enabled: false,
      },
    };
  }, [completedTodosData]);

  return (
    <div className="most-completed-todos">
      <HighchartsReact
        highcharts={Highcharts}
        options={mostCompletedTodosChartOptions}
      />
    </div>
  );
};

export default MostCompletedTodos;
