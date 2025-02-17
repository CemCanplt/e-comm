import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import PageContent from "./components/PageContent";
import SignUp from "./components/SignUp";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={PageContent} />
        <Route path="/signup" component={SignUp} />
      </Switch>
      <Footer />
      <ToastContainer />
    </Router>
  );
}

export default App;
