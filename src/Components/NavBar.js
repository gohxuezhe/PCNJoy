import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import Landmarks from "./Landmarks";
import SavedPlace from "./SavedPlace";
import SavedRoutes from "./SavedRoutes";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { auth } from "../Firebase/firebase-config";
import { signOut } from "firebase/auth";
import { Navigate } from "react-router-dom";

import classes from "./NavBar.module.css";
import Directions from "./Directions";

const searchBarLimit = 5;

function NavBar(props) {
  const [userSignOut, setUserSignOut] = useState(false);
  const [searchBar, setSearchBar] = useState([
    <SearchBar
      setCoord={props.setCoord}
      markers={props.markers}
      setMarkers={props.setMarkers}
      address={null}
      id={0}
      key={0}
    />,
  ]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Sign out success");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  auth.onAuthStateChanged((user) => {
    if (user) {
      return setUserSignOut(false);
    } else {
      setUserSignOut(true);
    }
  });

  useEffect(() => {
    setSearchBar([]);
    if (props.markers.length > 0) {
      props.markers.forEach((marker) => {
        setSearchBar((current) => {
          if (current.length > 0) {
            let newArray = [...current];
            newArray[current.length] = (
              <SearchBar
                setCoord={props.setCoord}
                markers={props.markers}
                setMarkers={props.setMarkers}
                address={marker.address}
                id={current.length}
                key={current.length}
              />
            );
            return newArray;
          } else {
            return [
              ...current,
              <SearchBar
                setCoord={props.setCoord}
                markers={props.markers}
                setMarkers={props.setMarkers}
                address={marker.address}
                id={0}
                key={0}
              />,
            ];
          }
        });
      });
    } else {
      setSearchBar([
        <SearchBar
          setCoord={props.setCoord}
          markers={props.markers}
          setMarkers={props.setMarkers}
          address={null}
          id={0}
          key={0}
        />,
      ]);
    }
  }, [props.markers]);

  useEffect(() => {
    if (props.mapsLoaded) {
      setSearchBar([
        <SearchBar
          setCoord={props.setCoord}
          markers={props.markers}
          setMarkers={props.setMarkers}
          address={null}
          id={0}
          key={0}
        />,
      ]);
    } else {
      setSearchBar([])
    }
  }, [props.mapsLoaded])

  const createSearchBar = () => {
    if (searchBar.length < searchBarLimit) {
      setSearchBar((current) => {
        if (current.length > 0) {
          let newArray = [...current];
          newArray[current.length] = (
            <SearchBar
              setCoord={props.setCoord}
              markers={props.markers}
              setMarkers={props.setMarkers}
              address={null}
              id={current.length}
              key={current.length}
            />
          );
          return newArray;
        } else {
          return [
            ...current,
            <SearchBar
              setCoord={props.setCoord}
              markers={props.markers}
              setMarkers={props.setMarkers}
              address={null}
              id={0}
              key={0}
            />,
          ];
        }
      });
    }
  };

  function routeHandler(showRoute) {
    if (showRoute) {
      props.setRouteReq(true);
      props.setRouteState(true);
    } else {
      props.setRouteState(false);
      props.setrouteLatlngs([]);
    }
  }

  let body, buttons;
  if (props.isRouted) {
    buttons = (
      <div>
        <Button variant="danger" onClick={() => routeHandler(false)}>
          {" "}
          Back{" "}
        </Button>
        <Button variant="secondary"> Add to Saved Routes </Button>
      </div>
    );

    body = (
      <div>
        <hr className={classes.rounded}></hr>
        <Directions data={props.cleanRouteData} />
      </div>
    );
  } else {
    buttons = (
      <div>
        <Button
          onClick={createSearchBar}
          disabled={searchBar.length >= searchBarLimit}
        >
          + Add Point to Route
        </Button>
        <Button
          disabled={props.markers.length < 2}
          onClick={() => routeHandler(true)}
        >
          Done
        </Button>
      </div>
    );

    body = (
      <div>
        <hr className={classes.rounded}></hr>
        <Landmarks />
        <hr className={classes.solid}></hr>
        <SavedPlace />
        <hr className={classes.solid}></hr>
        <SavedRoutes />
      </div>
    );
  }

  if (userSignOut) {
    return <Navigate to="/login" />;
  } else {
    return (
      <div>
        <div className={classes.title}>
          <div>PCNJOY</div>
          <div>
            {" "}
            <Button onClick={handleSignOut}>Sign Out</Button>
          </div>
        </div>
        <hr className={classes.solid}></hr>

        {searchBar}
        {buttons}
        {body}
      </div>
    );
  }
}

export default NavBar;
