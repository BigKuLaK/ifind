import { BrowserRouter as Router } from "react-router-dom";

import Layout from "./Layout";
import { ENVIRONMENT } from "@config/environment";
import GridGuide from "@components/GridGuide";

function App() {
  return (
    <Router>
      <Layout />
      <GridGuide renderIf={/dev|local/i.test(ENVIRONMENT)} />
    </Router>
  );
}

export default App;
