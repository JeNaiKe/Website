import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "../../services/auth.service";
import authHeader from "../../services/auth-header";

import TopBar from "../../components/TopBar/topbar";
import Footer from "../../components/Footer/footer"


function LandingView() {

  const [currentUser, setcurrentUser] = useState("");
  const { user: storageUser } = useSelector((state) => state.auth);

  return (
    <div>
      <TopBar title="landing" user={currentUser} />
      <div class="container"></div>
      <Footer/>
    </div>
  );
}

export default LandingView;
