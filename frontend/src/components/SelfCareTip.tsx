import React, { useState, useEffect } from "react";

const tips = [
  "Take a deep breath",
  "Drink water",
  "Stretch for a minute",
  "Take a screen break",
  "Smile",
  "Walk for 5 minutes",
];

const SelfCareTip = () => {
  const [tip, setTip] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setTip(tips[randomIndex]);
  }, []);

  return (
    <div style={{ padding: "1rem", background: "#e0f7fa", borderRadius: "8px", marginBottom: "1rem" }}>
      <strong>Self-Care Tip:</strong> {tip}
    </div>
  );
};

export default SelfCareTip;
