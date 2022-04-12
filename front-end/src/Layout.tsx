import { Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { Providers } from "@contexts";
// import routesPages, { dynamicRoutePages } from "@config/routesPages";
import Routes from "@config/routes";
import { locale } from "@config/locale";

import Header from "@components/Header";
import Footer from "@components/Footer";
import NewsLetter from "@components/NewsLetter";
import IfindLoading from "@components/IfindLoading";

import "./App.module.scss";

const Layout = () => (
  <Switch>
    <Route path="/" exact render={() => <Redirect to={`/${locale}`} />} />
    <Route
      path="/:language"
      render={() => (
        <Providers>
          <Header />
          <main className="main">
            <Suspense fallback={<IfindLoading />}>
              <Routes />
            </Suspense>
          </main>
          <NewsLetter />
          <Footer />
        </Providers>
      )}
    />
  </Switch>
);

export default Layout;
