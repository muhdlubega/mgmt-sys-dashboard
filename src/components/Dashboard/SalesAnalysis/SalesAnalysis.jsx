import React, { useEffect, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import AccessibilityModule from "highcharts/modules/accessibility";

import { useAuth } from "../../../context/AuthContext";

import "./SalesAnalysis.scss";

const SalesAnalysis = () => {
  AccessibilityModule(Highcharts);
  const { salesData, fetchSalesData } = useAuth();

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  const chartOptions = useMemo(() => {
    //Sort quarters according to year order followed by quarter order
    const quarters = Object.keys(salesData).sort((a, b) => {
      const [qA, yearA] = a.split(" ");
      const [qB, yearB] = b.split(" ");
      const quarterA = parseInt(qA.slice(1));
      const quarterB = parseInt(qB.slice(1));
      if (yearA === yearB) {
        return quarterA - quarterB;
      }
      return parseInt(yearA) - parseInt(yearB);
    });
    const revenueData = quarters.map((quarter) => salesData[quarter].revenue);
    const profitData = quarters.map((quarter) => salesData[quarter].profit);

    return {
      chart: {
        type: "bar",
        height: 400,
        backgroundColor: "royalblue",
      },
      title: {
        text: "Quarterly Sales Analysis",
        style: {
          color: "white",
        },
      },
      xAxis: {
        categories: quarters,
        title: {
          text: "Quarter",
          style: {
            color: "white",
          },
        },
        labels: {
          style: {
            color: "white",
          },
        },
      },
      yAxis: {
        title: {
          text: "Amount (USD)",
          style: {
            color: "white",
          },
        },
        gridLineColor: "black",
        labels: {
          style: {
            color: "white",
          },
        },
      },
      plotOptions: {
        bar: {
          borderColor: "transparent",
        },
      },
      legend: {
        itemStyle: {
          color: "white",
        },
        itemHoverStyle: {
          color: "black",
        },
        itemHiddenStyle: {
          color: "white",
        },
      },
      series: [
        {
          name: "Revenue",
          data: revenueData,
        },
        {
          name: "Profit",
          data: profitData,
        },
      ],
      credits: {
        enabled: false,
      },
    };
  }, [salesData]);

  return (
    <div className="sales-analysis">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default SalesAnalysis;
