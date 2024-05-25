import React from "react";

import {
  AverageComments,
  Heatmap,
  InventoryLevel,
  MostCompletedTodos,
  PendingOrders,
  RecentTransactions,
  SalesAnalysis,
  TopWords,
} from "../../components";

import "./Dashboard.scss";

const Dashboard = () => {
  return (
    <div className="main-content-holder">
      <div className="content-grid-one">
        <SalesAnalysis />
        <RecentTransactions />
        <PendingOrders />
      </div>
      <div className="content-grid-two">
        <InventoryLevel />
        <div className="grid-two-item">
          <div className="subgrid-two">
            <AverageComments />
            <TopWords />
          </div>
        </div>
        <div className="grid-two-item">
          <div className="subgrid-two">
            <MostCompletedTodos />
            <Heatmap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
