import React, { useEffect } from "react";
import Home from "./pages/Home";
import AllTasks from "./pages/AllTasks";
import ImportantTasks from "./pages/ImportantTasks";
import CompletedTasks from "./pages/CompletedTasks";
import IncompletedTasks from "./pages/IncompletedTasks";
import { Routes, Route, useNavigate } from "react-router-dom";
import { authActions } from "./store/auth";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import FrontPage from "./pages/FrontPage";
import ContactForm from "./pages/ContactForm";
import Profile from "./pages/Profile";
import TeamPage from "./pages/TeamPage";
import JoinTeam from "./pages/JoinTeam";
import OverdueTasks from "./pages/OverdueTasks";
import Analytics from "./pages/Analytics";
import Analysis from "./pages/Analysis";

import { useSelector, useDispatch } from "react-redux";
import TeamTasks from "./pages/TeamTasks";
import PendingTasks from "./pages/PendingRequests";
const App = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem("id") && localStorage.getItem("token")) {
      dispatch(authActions.login());
    } else if (
      isLoggedIn === false &&
      window.location.pathname !== "/verify-email"
    ) {
      navigate("/frontpage");
    }
  }, []);

  return (
    <div className="bg-gray-900 text-white md:h-[100%] p-2 relative">
      <Routes>
        <Route exact path="/" element={<Home />}>
          <Route index element={<AllTasks />} />
          <Route path="/importantTasks" element={<ImportantTasks />} />
          <Route path="/completedTasks" element={<CompletedTasks />} />
          <Route path="/incompletedTasks" element={<IncompletedTasks />} />
          <Route path="/overdueTasks" element={<OverdueTasks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/team/:id" element={<TeamPage />} />
          <Route path="/join-team" element={<JoinTeam />} />
          <Route path="teams/:id/tasks" element={<TeamTasks />} />
          <Route path="/pendingRequests" element={<PendingTasks />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/analysis" element={<Analysis />} />
        </Route>
        <Route path="/frontpage" element={<FrontPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contactform" element={<ContactForm />} />
      </Routes>
    </div>
  );
};

export default App;
