import React from "react";
import { Timestamp } from "firebase/firestore";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { FaPersonCircleQuestion, FaTrash } from "react-icons/fa6";

import { useAuth } from "../../../context/AuthContext";

import { recentTransactionsSchema } from "../../../utils/validationSchema";

import "./RecentTransactions.scss";

const RecentTransactions = () => {
  const { user, addTransaction, transactions, deleteTransaction } = useAuth();

  const handleSubmit = async (values, { resetForm }) => {
    if (user) {
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
      <h2>Recent Transactions</h2>
      {user ? (
        <div className="recent-transactions__content">
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
            <ul>
              {transactions.map((transaction, index) => (
                <li key={index}>
                  <p>{transaction.description}</p>
                  <p>USD {transaction.amount.toFixed(2)}</p>
                  <p>Added: {transaction.date.toDateString()}</p>
                  <FaTrash onClick={() => deleteTransaction(transaction.id)} />
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <FaPersonCircleQuestion size={64} />
              No recent transactions available. Add a new transaction above
            </div>
          )}
        </div>
      ) : (
        <div>
          <FaPersonCircleQuestion size={64} />
          Login to add & check your recent transactions
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
