import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import SignIn from "./components/SignIn";
import Places from "./components/Places";
import CurrentPlace from "./components/CurrentPLace";
import PlaceAdd from "./components/PLaceAdd";
import UserDetail from "./components/UserDetial";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/places" element={<Places />} />
          <Route path="/me" element={<CurrentPlace />} />
          <Route path="/placeadd" element={<PlaceAdd />}></Route>
          <Route path="/users/:userId" element={<UserDetail />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
