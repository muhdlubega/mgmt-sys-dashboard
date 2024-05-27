import React from "react";
import { Timestamp } from "firebase/firestore";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { FaPersonCircleQuestion, FaTrash } from "react-icons/fa6";

import { useAuth } from "../../../context/AuthContext";

import { recentTransactionsSchema } from "../../../utils/validationSchema";

import "./RecentTransactions.scss";

const RecentTransactions = () => {
  const { firestoreUser, addTransaction, transactions, deleteTransaction } =
    useAuth();

  const handleSubmit = async (values, { resetForm }) => {
    if (firestoreUser) {
      try {
        await addTransaction({
          ...values,
          amount: parseFloat(values.amount),
          date: Timestamp.now(),
        });
        resetForm();
      } catch (error) {
        console.error("Error adding transaction: ", error);
      }
    }
  };

  return (
    <div className="recent-transactions">
      <h3>Recent Transactions</h3>
      {firestoreUser ? (
        <div>
          <Formik
            initialValues={{ description: "", amount: "" }}
            validationSchema={recentTransactionsSchema}
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
                  {isSubmitting ? "Adding..." : "Add Transaction"}
                </button>
              </Form>
            )}
          </Formik>
          {transactions.length > 0 ? (
            <ul className="recent-transactions__content">
              {transactions.map((transaction, index) => (
                <li className="recent-transactions__item" key={index}>
                  <div>
                    <p>
                      <strong>{transaction.description}</strong>
                    </p>
                    <p>
                      <strong>Amount:</strong> USD{" "}
                      {transaction.amount.toFixed(2)}
                    </p>
                    <p>
                      <strong>Added:</strong> {transaction.date.toDateString()}
                    </p>
                  </div>
                  <FaTrash
                    size={18}
                    onClick={() => deleteTransaction(transaction.id)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="recent-transactions__empty">
              <FaPersonCircleQuestion size={firestoreUser ? 96 : 144} />
              No recent transactions available. Add a new transaction above
            </div>
          )}
        </div>
      ) : (
        <div className="recent-transactions__empty">
          <FaPersonCircleQuestion size={144} />
          Login to add & check your recent transactions
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
