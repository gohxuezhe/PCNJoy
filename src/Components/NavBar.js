import React, {useState} from 'react';
import SearchBar from "./SearchBar";
import Landmarks from "./Landmarks";
import SavedPlace from "./SavedPlace";
import SavedRoutes from "./SavedRoutes";
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { auth } from '../Firebase/firebase-config';
import { signOut } from "firebase/auth";
import { Navigate } from "react-router-dom"

import "./NavBar.css";

function NavBar() {
  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log("Sign out success")
    }).catch((error) => {
      console.log(error)
    });

  }

  const [userSignOut, setUserSignOut] = useState(false);
  auth.onAuthStateChanged((user)=>{
    if(user) {
      return setUserSignOut(false);
    }
    else {
      setUserSignOut(true);
    }
  })

  console.log("user signed out? ", userSignOut);

  if (userSignOut) {
    return <Navigate to = "/login" />
  }
  else {
    return (
      <div className="SideBar">
        <div className="title">
          <div>PCNJOY</div>
          <div>
            {" "}
            <Button onClick={handleSignOut}>Sign Out</Button>
          </div>
        </div>
        <hr class="solid"></hr>
        <SearchBar />
        <hr class="rounded"></hr>
        <Landmarks />
        <hr class="solid"></hr>
        <SavedPlace />
        <hr class="solid"></hr>
        <SavedRoutes />
      </div>
    );
  }
}

export default NavBar;