import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Home,
  SignIn,
  About,
  Profile,
  SignUp,
  CreateListing,
  UpdateListing,
  Listing,
  Search,
} from "./pages";
import { Header, PrivateRoute } from "./components";

export const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:id" element={<Listing />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/update-listing/:id" element={<UpdateListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
