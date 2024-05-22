import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Loader, Navbar } from "./components";
import { lazy, Suspense } from "react";
import "./App.css";

const LazyHomepage = lazy(() => import("./pages/Homepage/Homepage"));
const LazyDashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const LazyUsers = lazy(() => import("./pages/Users/Users"));
const LazyPosts = lazy(() => import("./pages/Posts/Posts"));
const LazyUserProfile = lazy(() => import("./pages/UserProfile/UserProfile"));
const LazyPostDetails = lazy(() => import("./pages/PostDetails/PostDetails"));
const LazyError404 = lazy(() => import("./pages/Error404/Error404"));

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<Loader />}>
                <LazyHomepage />
              </Suspense>
            }
          ></Route>
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<Loader />}>
                <LazyDashboard />
              </Suspense>
            }
          ></Route>
          <Route
            path="/users"
            element={
              <Suspense fallback={<Loader />}>
                <LazyUsers />
              </Suspense>
            }
          ></Route>
          <Route
            path="/posts"
            element={
              <Suspense fallback={<Loader />}>
                <LazyPosts />
              </Suspense>
            }
          ></Route>
          <Route
            path="/user/:id"
            element={
              <Suspense fallback={<Loader />}>
                <LazyUserProfile />
              </Suspense>
            }
          ></Route>
          <Route
            path="/post/:id"
            element={
              <Suspense fallback={<Loader />}>
                <LazyPostDetails />
              </Suspense>
            }
          ></Route>
          <Route
            path="/*"
            element={
              <Suspense fallback={<Loader />}>
                <LazyError404 />
              </Suspense>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
