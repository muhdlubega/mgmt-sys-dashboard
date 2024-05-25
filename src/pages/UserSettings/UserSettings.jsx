import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { ErrorMessage, Field, Form, Formik } from "formik";

import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebaseConfig";

import userSettingsSchema from "../../utils/validationSchema";

import "./UserSettings.scss";

const UserSettings = () => {
  const { user, updateUserDetails, setAlert } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    displayName: "",
    username: "",
    address: {
      street: "",
      suite: "",
      city: "",
      zipcode: "",
      geo: {
        lat: "",
        lng: "",
      },
    },
    phone: "",
    website: "",
    company: {
      name: "",
      catchPhrase: "",
      bs: "",
    },
  });

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setInitialValues({
            displayName: userData.displayName || "",
            username: userData.username || "",
            address: {
              street: userData.address?.street || "",
              suite: userData.address?.suite || "",
              city: userData.address?.city || "",
              zipcode: userData.address?.zipcode || "",
              geo: {
                lat: userData.address?.geo?.lat || "",
                lng: userData.address?.geo?.lng || "",
              },
            },
            phone: userData.phone || "",
            website: userData.website || "",
            company: {
              name: userData.company?.name || "",
              catchPhrase: userData.company?.catchPhrase || "",
              bs: userData.company?.bs || "",
            },
          });
        }
      };
      fetchUserData();
    }
  }, [user]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await updateUserDetails(user.uid, values);
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-settings">
      <h2>User Settings</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={userSettingsSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, isValid }) => (
          <Form>
            <div>
              <label>Name</label>
              <Field type="text" name="displayName" />
              <ErrorMessage
                name="displayName"
                component="div"
                className="error"
              />
            </div>
            <div>
              <label>Username</label>
              <Field type="text" name="username" />
              <ErrorMessage name="username" component="div" className="error" />
            </div>
            <div>
              <label>Street</label>
              <Field type="text" name="address.street" />
              <ErrorMessage
                name="address.street"
                component="div"
                className="error"
              />
            </div>
            <div>
              <label>Suite</label>
              <Field type="text" name="address.suite" />
              <ErrorMessage
                name="address.suite"
                component="div"
                className="error"
              />
            </div>
            <div>
              <label>City</label>
              <Field type="text" name="address.city" />
              <ErrorMessage
                name="address.city"
                component="div"
                className="error"
              />
            </div>
            <div>
              <label>Zip Code</label>
              <Field type="text" name="address.zipcode" />
              <ErrorMessage
                name="address.zipcode"
                component="div"
                className="error"
              />
            </div>
            <div>
              <label>Latitude</label>
              <Field type="text" name="address.geo.lat" />
              <ErrorMessage
                name="address.geo.lat"
                component="div"
                className="error"
              />
            </div>
            <div>
              <label>Longitude</label>
              <Field type="text" name="address.geo.lng" />
              <ErrorMessage
                name="address.geo.lng"
                component="div"
                className="error"
              />
            </div>
            <div>
              <label>Phone</label>
              <Field type="text" name="phone" />
              <ErrorMessage name="phone" component="div" className="error" />
            </div>
            <div>
              <label>Website</label>
              <Field type="text" name="website" />
              <ErrorMessage name="website" component="div" className="error" />
            </div>
            <div>
              <label>Company Name</label>
              <Field type="text" name="company.name" />
              <ErrorMessage
                name="company.name"
                component="div"
                className="error"
              />
            </div>
            <div>
              <label>Catch Phrase</label>
              <Field type="text" name="company.catchPhrase" />
              <ErrorMessage
                name="company.catchPhrase"
                component="div"
                className="error"
              />
            </div>
            <div>
              <label>BS</label>
              <Field type="text" name="company.bs" />
              <ErrorMessage
                name="company.bs"
                component="div"
                className="error"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !isValid || loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserSettings;
