import React from "react";

const Card = ({ children }) => (
  <div className="border rounded-lg p-4 shadow-md">{children}</div>
);

const CardContent = ({ children }) => <div>{children}</div>;

export { Card, CardContent };
