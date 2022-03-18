import React, { useState, useEffect } from "react";
import Map from "../Components/Map";
import NavBar from "../Components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import classes from "./MainPage.module.css";

function MainPage() {
  const [mapsLoaded, setMapsLoaded] = useState(false)
  const [coord, setCoord] = useState({ lat: 1.3521, lng: 103.8198 });
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [address, setAddress] = useState(null);
  const [token, setToken] = useState();
  const [routeData, setRouteData] = useState({});
  const [cleanRouteData, setCleanRouteData] = useState({
    duration: null,
    distance: null,
    via: null,
    directions: [],
  });

  const [routeReq, setRouteReq] = useState(false);
  const [isRouted, setRouteState] = useState(false);
  const [routeLatlngs, setrouteLatlngs] = useState([]);

  useEffect(() => {
    getToken();
  }, []);

  async function getToken() {
    try {
      const response = await fetch("http://127.0.0.1:9999/getToken", {
        method: "POST",
        headers: { "content-type": "application/json" },
      });

      const data = await response.json();
      setToken(data.access_token);
    } catch (error) {
      console.log(error);
    }
  }

  // oneMap Routing Api
  async function getRoute(start, end) {
    try {
      const response = await fetch("http://127.0.0.1:9999/route", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          start: start,
          end: end,
          routeType: "cycle",
          token: token,
        }),
      });
      const data = await response.json();
      setRouteData(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function plotRoute() {
    console.log("PLOT ROUTE CALLED");
    await getRoute(markers[0].key, markers[1].key);

    // data cleaning
    const timeSeconds = routeData.route_summary.total_time;
    const timeHM =
      timeSeconds >= 3600
        ? Math.floor(timeSeconds / 3600) +
          "hr " +
          Math.floor((timeSeconds % 3600) / 60) +
          "min"
        : Math.floor(timeSeconds / 60) + "min";

    const distKm =
      Math.round(routeData.route_summary.total_distance / 1000) + "km";
    const via = routeData.route_name.join(", ");

    const directions = [];
    routeData.route_instructions.forEach((item) => {
      directions.push(item[9]);
    });

    setCleanRouteData({
      duration: timeHM,
      distance: distKm,
      via: via,
      directions: directions,
    });

    // decode polyline
    const encoded = routeData.route_geometry;
    var polyUtil = require("polyline-encoded");
    const latlngArray = polyUtil.decode(encoded);
    var latlngs = [];
    latlngArray.forEach((item) => {
      const output = {
        lat: item[0],
        lng: item[1],
      };
      latlngs.push(output);
    });
    setRouteReq(false);
    setrouteLatlngs(latlngs);
  }

  if (routeReq) {
    plotRoute();
  }

  return (
    <div className={classes.root}>
      <div className={classes.Map}>
        <Map
          setMapsLoaded={setMapsLoaded}
          routeLatlngs={routeLatlngs}
          coord={coord}
          markers={markers}
          setMarkers={setMarkers}
          selected={selected}
          setSelected={setSelected}
          address={address}
          setAddress={setAddress}
          routeData={routeData}
        />
      </div>
      <div className={classes.NavBar}>
        <NavBar
          mapsLoaded={mapsLoaded}
          setCoord={setCoord}
          markers={markers}
          setMarkers={setMarkers}
          address={address}
          setAddress={setAddress}
          setRouteReq={setRouteReq}
          setRouteState={setRouteState}
          isRouted={isRouted}
          cleanRouteData={cleanRouteData}
          setrouteLatlngs={setrouteLatlngs}
        />
      </div>
    </div>
  );
}

export default MainPage;
