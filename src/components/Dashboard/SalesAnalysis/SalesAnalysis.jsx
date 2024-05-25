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
      },
      title: {
        text: "Quarterly Sales Analysis",
      },
      xAxis: {
        categories: quarters,
        title: {
          text: "Quarter",
        },
      },
      yAxis: {
        title: {
          text: "Amount (USD)",
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
    };
  }, [salesData]);

  return (
    <div className="sales-analysis">
      <h2>Sales Analysis</h2>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default SalesAnalysis;
