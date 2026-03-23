import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router";
import { UserContext } from "./contexts/UserContext.jsx";
import "./App.css";
import NavBar from "./components/NavBar/NavBar.jsx";
import SignUpForm from "./components/SignUpForm/SignUpForm.jsx";
import SignInForm from "./components/SignInForm/SignInForm.jsx";
import Landing from "./components/Landing/Landing.jsx";
import AppLayout from "./components/shared/AppLayout/AppLayout.jsx";

import ExerciseDetail from "./components/ExerciseLibrary/ExerciseDetail.jsx";
import ExerciseLibrary from "./components/ExerciseLibrary/ExerciseLibrary.jsx";
import Profile from "./components/Calendar/Profile.jsx";
import Explore, {
  ExploreIndexRedirect,
} from "./components/Training/Explore/Explore.jsx";
import TrainingPage from "./components/Training/TrainingPage.jsx";
import LoadingSpinner from "./components/shared/LoadingSpinner/LoadingSpinner.jsx";

const App = () => {
  const { user, loading } = useContext(UserContext);
  if (loading) {
    return <LoadingSpinner variant="fullscreen" message="Loading…" size="lg" />;
  }
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />

        {/* Main Entry Point */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Landing />} />
          {user && (
            <>
              <Route path="profile" element={<Profile />} />
              <Route path="exercises" element={<ExerciseLibrary />} />
              <Route
                path="exercises/:exerciseId"
                element={<ExerciseDetail />}
              />
              <Route path="explore/:tab" element={<Explore />} />
              <Route path="explore" element={<ExploreIndexRedirect />} />
              <Route path="training" element={<TrainingPage />} />
              <Route path="workouts" element={<TrainingPage />} />
            </>
          )}
        </Route>

        {/* CATCH-ALL: Redirects unknown URLs to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
