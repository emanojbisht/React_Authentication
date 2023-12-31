import { Fragment } from "react";

import MainNavigation from "./MainNavigation";
import { Outlet } from "react-router-dom";

const Layout = (props) => {
  return (
    <Fragment>
      <MainNavigation />
      <main>
        <Outlet />
      </main>
    </Fragment>
  );
};

export default Layout;
