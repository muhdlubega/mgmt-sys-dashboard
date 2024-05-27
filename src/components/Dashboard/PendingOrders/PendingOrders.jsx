import React from "react";
import { Timestamp } from "firebase/firestore";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { FaPersonCircleQuestion, FaTrash } from "react-icons/fa6";

import { useAuth } from "../../../context/AuthContext";

import { pendingOrdersSchema } from "../../../utils/validationSchema";

import "./PendingOrders.scss";

const PendingOrders = () => {
  const { firestoreUser, addPendingOrder, pendingOrders, deletePendingOrder } =
    useAuth();

  const handleSubmit = async (values, { resetForm }) => {
    if (firestoreUser) {
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
      <h3>Pending Orders</h3>
      {firestoreUser ? (
        <div>
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
            <ul className="pending-orders__content">
              {pendingOrders.map((order, index) => (
                <li className="pending-orders__item" key={index}>
                  <div>
                    <p>
                      <strong>{order.description}</strong>
                    </p>
                    <p>
                      <strong>Amount: </strong>
                      {order.amount}
                    </p>
                    <p>
                      <strong>Added:</strong> {order.date.toDateString()}
                    </p>
                  </div>
                  <FaTrash
                    size={18}
                    onClick={() => deletePendingOrder(order.id)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="pending-orders__empty">
              <FaPersonCircleQuestion size={firestoreUser ? 96 : 144} />
              No pending orders available. Add a new order above
            </div>
          )}
        </div>
      ) : (
        <div className="pending-orders__empty">
          <FaPersonCircleQuestion size={144} />
          Login to add & check your pending orders
        </div>
      )}
    </div>
  );
};

export default PendingOrders;
