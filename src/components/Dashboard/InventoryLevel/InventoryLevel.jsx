import React, { useMemo } from "react";
import { Timestamp } from "firebase/firestore";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import AccessibilityModule from "highcharts/modules/accessibility";

import { useAuth } from "../../../context/AuthContext";

import { inventorySchema } from "../../../utils/validationSchema";

import "./InventoryLevel.scss";

const InventoryLevel = () => {
  AccessibilityModule(Highcharts);
  const { addInventory, inventory } = useAuth();

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await addInventory({
        ...values,
        quantity: parseFloat(values.quantity),
        date: Timestamp.now(),
      });
      resetForm();
    } catch (error) {
      console.error("Error adding inventory: ", error);
    }
  };

  const chartOptions = useMemo(() => {
    const data = inventory.reduce((acc, item) => {
      const date = item.date?.toISOString().split("T")[0];
      if (date) {
        acc[date] = (acc[date] || 0) + item.quantity;
      }
      return acc;
    }, {});

    const categories = Object.keys(data);
    const seriesData = Object.values(data);

    return {
      chart: {
        type: "bar",
        height: 400,
        backgroundColor: "#2a2e34",
      },
      title: {
        text: "Inventory Added Per Day",
        style: {
          color: "#616b78",
        },
      },
      xAxis: {
        categories,
        title: {
          text: "Date",
        },
        labels: {
          style: {
            color: "#616b78",
          },
        },
      },
      yAxis: {
        title: {
          text: "Quantity",
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
          name: "Inventory",
          data: seriesData,
        },
      ],
      credits: {
        enabled: false,
      },
    };
  }, [inventory]);

  return (
    <div className="inventory-level">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      <Formik
        initialValues={{ description: "", quantity: "" }}
        validationSchema={inventorySchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <Form>
            <div>
              <Field type="text" name="description" placeholder="Description" />
              <ErrorMessage
                name="description"
                component="div"
                className="error"
              />
            </div>
            <div>
              <Field type="number" name="quantity" placeholder="Quantity" />
              <ErrorMessage name="quantity" component="div" className="error" />
            </div>
            <button type="submit" disabled={isSubmitting || !isValid}>
              {isSubmitting ? "Adding..." : "Add Inventory"}
            </button>
          </Form>
        )}
      </Formik>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Date Added</th>
          </tr>
        </thead>
        <tbody>
          {inventory.slice(0, 6).map((item, index) => (
            <tr key={index}>
              <td>{item.description}</td>
              <td>{item.quantity}</td>
              <td>{item.date ? item.date.toDateString() : "No Date"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryLevel;
