import React from "react";
import { Timestamp } from "firebase/firestore";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { FaPersonCircleQuestion, FaTrash } from "react-icons/fa6";

import { useAuth } from "../../../context/AuthContext";

import { pendingOrdersSchema } from "../../../utils/validationSchema";

import "./PendingOrders.scss";

const PendingOrders = () => {
  const { user, addPendingOrder, pendingOrders, deletePendingOrder } =
    useAuth();

  const handleSubmit = async (values, { resetForm }) => {
    if (user) {
      try {
        await addPendingOrder({
          ...values,
          amount: parseFloat(values.amount),
          date: Timestamp.now(),
        });
        resetForm();
      } catch (error) {
        console.error("Error adding order: ", error);
      }
    }
  };

  return (
    <div className="pending-orders">
      <h2>Pending Orders</h2>
      {user ? (
        <div className="pending-orders__content">
          <Formik
            initialValues={{ description: "", amount: "" }}
            validationSchema={pendingOrdersSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid }) => (
              <Form>
                <div>
                  <Field
                    type="text"
                    name="description"
                    placeholder="Description"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="error"
                  />
                </div>
                <div>
                  <Field type="number" name="amount" placeholder="Amount" />
                  <ErrorMessage
                    name="amount"
                    component="div"
                    className="error"
                  />
                </div>
                <button type="submit" disabled={isSubmitting || !isValid}>
                  {isSubmitting ? "Adding..." : "Add Order"}
                </button>
              </Form>
            )}
          </Formik>
          {pendingOrders.length > 0 ? (
            <ul>
              {pendingOrders.map((order, index) => (
                <li key={index}>
                  <p>{order.description}</p>
                  <p>{order.amount}</p>
                  <p>{order.date.toDateString()}</p>
                  <FaTrash onClick={() => deletePendingOrder(order.id)} />
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <FaPersonCircleQuestion size={64} />
              No pending orders available. Add a new order above
            </div>
          )}
        </div>
      ) : (
        <div>
          <FaPersonCircleQuestion size={64} />
          Login to add & check your pending orders
        </div>
      )}
    </div>
  );
};

export default PendingOrders;
