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
import ShoppingCart from "./components/ShoppingCart";

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

          {/* Ürün detay rotasını en spesifik rotalardan önce tanımlayalım */}
          <Route path="/shop/product/:id" component={ProductDetail} />

          <Route exact path="/shop" component={Shop} />
          <Route exact path="/shop/:gender" component={Shop} />
          <Route
            path="/shop/:gender/:categoryName/:categoryId"
            component={Shop}
          />

          {/* Diğer rotalar */}
          <Route path="/contact" component={Contact} />
          <Route path="/team" component={Team} />
          <Route path="/aboutUs" component={AboutUsPage} />
          <Route path="/cart" component={ShoppingCart} />
          <Route path="*" component={() => <h1>404 Not Found</h1>} />
        </Switch>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
