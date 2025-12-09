import React from "react";

// MUI Icons
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import BoltIcon from "@mui/icons-material/Bolt";
import SearchIcon from "@mui/icons-material/Search";

// Components :-
import Heading from "../../components/publicComponents/home/Heading";
import FeaturesSection from "../../components/publicComponents/home/FeaturesSection";
import StepsSection from "../../components/publicComponents/home/StepsSection";

const HomeContainer = () => {
  const featureData = [
    {
      id: "feature-1",
      icon: <CloudUploadIcon fontSize="large" sx={{ color: "white" }} />,
      title: "Smart Upload",
      description:
        "Upload images, videos, and documents. Our AI automatically processes them in the background.",
    },
    {
      id: "feature-2",
      icon: <BoltIcon fontSize="large" sx={{ color: "white" }} />,
      title: "AI Analysis",
      description:
        "Automatic description generation, intelligent tagging, and topic extraction using GPT-4.",
    },
    {
      id: "feature-3",
      icon: <SearchIcon fontSize="large" sx={{ color: "white" }} />,
      title: "Semantic Search",
      description:
        "Find media using natural language. Search by meaning, not just keywords.",
    },
  ];

  return (
    <div>
      <Heading />
      <section id="features" className="scroll-mt-24">
        <FeaturesSection features={featureData} />
      </section>
      <section id="how-it-works" className="scroll-mt-24">
        <StepsSection />
      </section>
    </div>
  );
};

export default HomeContainer;
