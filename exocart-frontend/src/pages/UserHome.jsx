import Navbar from "../components/user/Navbar";
import Hero from "../components/user/Hero";
import Categories from "../components/user/Categories";
import PopularProducts from "../components/user/PopularProducts";

function UserHome() {
  return (
    <div className="bg-[#020817] min-h-screen">
      <Navbar />
      <Hero />
      <Categories />
      <PopularProducts />
    </div>
  );
}

export default UserHome;