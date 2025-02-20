import "./App.css";
import { Route, Switch } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import PageContent from "./components/PageContent";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Shop from "./components/Shop";
import ProductDetail from "./components/ProductDetail";
import Contact from "./components/content/Contact";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route exact path="/" component={PageContent} />
          <Route path="/signup" component={SignUp} />
          <Route path="/login" component={Login} />
          <Route exact path="/shop" component={Shop} />
          <Route path="/shop/product/:id" component={ProductDetail} />
          <Route path="/contact" component={Contact} />
        </Switch>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
