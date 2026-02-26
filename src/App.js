import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/pages/home/Home";
import Login from "./components/pages/login/Login";
import Register from "./components/pages/register/Register";
import Blog from "./components/pages/blog/Blog";
import Blogsingle from "./components/pages/blogsingle/Blogsingle";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import CreateBlog from "./components/pages/createblog/CreateBlog";
import { ToastContainer } from "react-toastify";
import Sendotp from "./components/pages/resetpassword/Sendotp";
import Enterotp from "./components/pages/resetpassword/Enterotp";
import Updatepassword from "./components/pages/resetpassword/Updatepassword";
import Error from "./components/pages/error/Error";
import Scroll from "./components/pages/scrolltotop/Scroll";
import Userprofile from "./components/pages/userprofile/Userprofile";
import Updateprofile from "./components/pages/userupdate/Updateprofile";
import {
  PrivateRoute,
  PrivateRouteadmin,
} from "./components/private/PrivateRoute";
import { PrivateRouteotp } from "./components/private/PrivateRoute";
import Adminpanel from "./components/pages/adminpanel/Adminpanel";
import Adminposts from "./components/pages/adminpanel/Adminposts";
import Adminusers from "./components/pages/adminpanel/Adminusers";
import Adminpostsingle from "./components/pages/adminpanel/Adminpostsingle";
import Adminlogin from "./components/pages/adminpanel/Adminlogin";
import Advertisement from "./components/pages/advertisement/Advertisement";
import Adminadvertisement from "./components/pages/adminpanel/Adminadvertisement";
import Admincategories from "./components/pages/adminpanel/Admincategories";
import Invoice from "./components/pages/advertisement/Invoice";

function App() {
  return (
    <>
      <ScrollToTop />
      <Scroll />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Error />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<Adminlogin />} />
        <Route element={<PrivateRouteadmin />}>
          <Route path="/adminpanal" element={<Adminpanel />} />
          <Route path="/adminposts" element={<Adminposts />} />
          <Route path="/adminusers" element={<Adminusers />} />
          <Route path="/adminadvertisement" element={<Adminadvertisement />} />
          <Route path="/admincategories" element={<Admincategories />} />
          <Route path="/admin/postsingle/:blogId" element={<Adminpostsingle />}/>
        </Route>
        <Route element={<PrivateRouteotp />}>
          <Route path="/sendotp" element={<Sendotp />} />
          <Route path="/enterotp/:userId" element={<Enterotp />} />
          <Route path="/updatepassword/:userId" element={<Updatepassword />} />
        </Route>
        {/* Protect the Blog and Blogsingle routes with PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path="/blog" element={<Blog />} />
          <Route path="/blogsingle/:blogId" element={<Blogsingle />} />
          <Route path="/createblog" element={<CreateBlog />} />
          <Route path="/editblog/:blogId" element={<CreateBlog />} />
          <Route path="/userprofile" element={<Userprofile />} />
          <Route path="/updateprofile/:userId" element={<Updateprofile />} />
          <Route path="/advertisement" element={<Advertisement />} />
          <Route path="/advertisement/invoice/:adId" element={<Invoice />} />
        </Route>
      </Routes>
      <Scroll />
      <ToastContainer />
    </>
  );
}

export default App;
