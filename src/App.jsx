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
import Team from "./components/Team";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { autoLogin } from "./store/actions/userActions";
import AboutUsPage from "./components/content/AboutUsPage";
import ShoppingCard from "./components/ShoppingCard";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(autoLogin());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route exact path="/" component={PageContent} />
          <Route path="/signup" component={SignUp} />
          <Route path="/login" component={Login} />

          {/* Shop routes with parameters - fixed order */}
          <Route exact path="/shop" component={Shop} />
          <Route
            path="/shop/:gender/:categoryName/:id"
            component={ProductDetail} // This will handle both product detail and category browsing
          />

          {/* Other routes */}
          <Route path="/contact" component={Contact} />
          <Route path="/team" component={Team} />
          <Route path="/about" component={AboutUsPage} />
          <Route path="/card" component={ShoppingCard} />

          {/* Fallback route */}
          <Route
            component={() => (
              <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
                <p className="mb-8">
                  The page you are looking for doesn't exist.
                </p>
              </div>
            )}
          />
        </Switch>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
