import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { runExercisesFetchTest } from "./lib/contentful/test-fetch-exercises.ts";

if (import.meta.env.DEV) {
  void runExercisesFetchTest();
}

createRoot(document.getElementById("root")!).render(<App />);
  
