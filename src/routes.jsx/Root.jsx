import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import LandingSlider from "../components/LandingSlider";
import LandingAbout from "../components/LandingAbout";
import { Outlet } from "react-router";
import Footer from "../components/Footer";
// import PostsSection from "../components/PostSection";

const Root = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost/college_api/current_user.php", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setUser(data.user);
      } catch (err) {
        console.error(err);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <div>
      <Navbar user={user} />
     <div className="pt-16"> {/* pt-16 = navbar height */}
    <Outlet />
    <Footer></Footer>
  </div>
      {/* <LandingSlider />
      <div className="my-6">
        <LandingAbout />
      </div> */}
      {/* <PostsSection user={user} /> */}
    </div>
  );
};

export default Root;
