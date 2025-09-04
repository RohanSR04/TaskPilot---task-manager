import React from "react";
import { useParams } from "react-router-dom";
import TeamTasks from "./TeamTasks";

const TeamPage = () => {
  const { id } = useParams();

  return <TeamTasks teamId={id} />;
};

export default TeamPage;
