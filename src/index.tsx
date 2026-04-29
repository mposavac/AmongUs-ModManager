import { createRoot } from "react-dom/client";
import { StartingScreen } from "./StartingScreen";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<StartingScreen />);
}
