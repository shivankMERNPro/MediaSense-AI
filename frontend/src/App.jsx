import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ParentRoute from "./routes";

function App() {
  return (
    <>
      {/* {Global Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      {/* Main App Router */}
      <ParentRoute />
    </>
  );
}

export default App;
