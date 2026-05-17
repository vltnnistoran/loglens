import { Typography } from "@mui/material";
import { DashboardLayout } from "./components/layout/DashboardLayout";

function App() {
  return (
    <DashboardLayout
      inputPanel={<Typography>Input panel placeholder</Typography>}
      resultsPanel={<Typography>Results panel placeholder</Typography>}
    />
  );
}

export default App;