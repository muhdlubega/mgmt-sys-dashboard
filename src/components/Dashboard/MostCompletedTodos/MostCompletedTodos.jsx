import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import AccessibilityModule from "highcharts/modules/accessibility";

import { useData } from "../../../context/DataContext";

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
      },
    };

    return {
      chart: {
        type: "pie",
      },
      title: {
        text: "Users with Most Completed Todos",
      },
      tooltip: {
        pointFormat:
          "{series.name}: <b>{point.y} ({point.percentage:.1f}%)</b>",
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
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
    };
  }, [completedTodosData]);

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={mostCompletedTodosChartOptions}
      />
    </div>
  );
};

export default MostCompletedTodos;
