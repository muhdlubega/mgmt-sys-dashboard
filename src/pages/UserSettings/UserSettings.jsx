import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { ErrorMessage, Field, Form, Formik } from "formik";

import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebaseConfig";

import userSettingsSchema from "../../utils/validationSchema";

import "./UserSettings.scss";

const UserSettings = () => {
  const { firestoreUser, updateUserDetails, setAlert } = useAuth();
  const [loading, setLoading] = useState(false);
  // Initial values of empty strings given for each parameter to avoid null errors
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
    if (firestoreUser) {
      const fetchUserData = async () => {
        const userDoc = await getDoc(doc(db, "users", firestoreUser.uid));
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
  }, [firestoreUser]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await updateUserDetails(firestoreUser.uid, values);
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
            <div className="user-settings__field">
              <div>
                <label>Name</label>
                <Field
                  placeholder="ex. John Doe"
                  type="text"
                  name="displayName"
                />
              </div>
              <ErrorMessage
                name="displayName"
                component="div"
                className="error"
              />
            </div>
            <div className="user-settings__field">
              <div>
                <label>Username</label>
                <Field
                  placeholder="ex. JohnDoe123"
                  type="text"
                  name="username"
                />
              </div>
              <ErrorMessage name="username" component="div" className="error" />
            </div>
            <div className="user-settings__field">
              <div>
                <label>Street</label>
                <Field
                  placeholder="ex. Avenue St."
                  type="text"
                  name="address.street"
                />
              </div>
              <ErrorMessage
                name="address.street"
                component="div"
                className="error"
              />
            </div>
            <div className="user-settings__field">
              <div>
                <label>Suite</label>
                <Field
                  placeholder="ex. Suite 098"
                  type="text"
                  name="address.suite"
                />
              </div>
              <ErrorMessage
                name="address.suite"
                component="div"
                className="error"
              />
            </div>
            <div className="user-settings__field">
              <div>
                <label>City</label>
                <Field
                  placeholder="ex. New York City"
                  type="text"
                  name="address.city"
                />
              </div>
              <ErrorMessage
                name="address.city"
                component="div"
                className="error"
              />
            </div>
            <div className="user-settings__field">
              <div>
                <label>Zip Code</label>
                <Field
                  placeholder="ex. 12345"
                  type="text"
                  name="address.zipcode"
                />
              </div>
              <ErrorMessage
                name="address.zipcode"
                component="div"
                className="error"
              />
            </div>
            <div className="user-settings__field">
              <div>
                <label>Latitude</label>
                <Field
                  placeholder="ex. 12.3456"
                  type="text"
                  name="address.geo.lat"
                />
              </div>
              <ErrorMessage
                name="address.geo.lat"
                component="div"
                className="error"
              />
            </div>
            <div className="user-settings__field">
              <div>
                <label>Longitude</label>
                <Field
                  placeholder="ex. 65.4321"
                  type="text"
                  name="address.geo.lng"
                />
              </div>
              <ErrorMessage
                name="address.geo.lng"
                component="div"
                className="error"
              />
            </div>
            <div className="user-settings__field">
              <div>
                <label>Phone</label>
                <Field placeholder="ex. 0123456789" type="text" name="phone" />
              </div>
              <ErrorMessage name="phone" component="div" className="error" />
            </div>
            <div className="user-settings__field">
              <div>
                <label>Website</label>
                <Field
                  placeholder="ex. johndoe.co"
                  type="text"
                  name="website"
                />
              </div>
              <ErrorMessage name="website" component="div" className="error" />
            </div>
            <div className="user-settings__field">
              <div>
                <label>Company Name</label>
                <Field
                  placeholder="ex. John Doe Inc."
                  type="text"
                  name="company.name"
                />
              </div>
              <ErrorMessage
                name="company.name"
                component="div"
                className="error"
              />
            </div>
            <div className="user-settings__field">
              <div>
                <label>Catch Phrase</label>
                <Field
                  placeholder="ex. Hi! The name's John Doe"
                  type="text"
                  name="company.catchPhrase"
                />
              </div>
              <ErrorMessage
                name="company.catchPhrase"
                component="div"
                className="error"
              />
            </div>
            <div className="user-settings__field">
              <div>
                <label>BS</label>
                <Field
                  placeholder="ex. enable real-time applications"
                  type="text"
                  name="company.bs"
                />
              </div>
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
