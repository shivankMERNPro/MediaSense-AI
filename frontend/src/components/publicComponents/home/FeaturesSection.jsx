import React from "react";
import Card from "@mui/material/Card";

const FeaturesSection = ({ features }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
      {features.map((item) => (
        <Card
          key={item.id}
          sx={{
            backgroundColor: "#693492",
            border: "1px solid  #866f9fff",
            borderRadius: "16px",
            padding: "24px",
            backdropFilter: "blur(10px)",
            textAlign: "left",
            transition: "all 0.3s ease-in-out",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#7a3fa3",
              border: "1px solid #a080c4",
              transform: "translateY(-4px)",
              boxShadow: "0 8px 24px rgba(107, 52, 146, 0.4)",
            },
          }}
        >
          <div className="text-3xl mb-4">{item.icon}</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {item.title}
          </h3>
          <p className="text-purple-200 text-sm">{item.description}</p>
        </Card>
      ))}
    </section>
  );
};

export default FeaturesSection;