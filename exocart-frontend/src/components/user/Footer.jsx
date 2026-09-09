import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import { X } from "lucide-react";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

function Footer() {
  const navigate = useNavigate();

  const [activeModal, setActiveModal] = useState(null);

  const companyLinks = [
    "About Us",
    "Contact Us",
    "Careers",
    "Blog",
  ];

  const supportLinks = [
    "Help Center",
    "FAQs",
    "Shipping Policy",
    "Return Policy",
    "Privacy Policy",
  ];

  const quickLinks = [
    "Home",
    "Products",
    "Categories",
    "Wishlist",
    "Cart",
  ];

  const socialLinks = [
    { icon: FaFacebookF, label: "Facebook" },
    { icon: FaInstagram, label: "Instagram" },
    { icon: FaTwitter, label: "Twitter" },
    { icon: FaLinkedinIn, label: "LinkedIn" },
  ];

  const modalContent = {
    "About Us": {
      title: "About ExoCart",
      content:
        "ExoCart is your one-stop destination for fresh groceries, daily essentials, snacks, beverages and household products delivered quickly to your doorstep.",
    },

    "Contact Us": {
      title: "Contact Us",
      content:
        "For any questions or support, please contact the ExoCart team. We are always happy to help you with your orders and shopping experience.",
    },

    Careers: {
      title: "Careers",
      content:
        "We're always looking for passionate people to join ExoCart. Career opportunities will be available soon.",
    },

    Blog: {
      title: "ExoCart Blog",
      content:
        "Our blog is coming soon with grocery tips, recipes, shopping guides and useful everyday information.",
    },

    "Help Center": {
      title: "Help Center",
      content:
        "Need help with your order? You can check your orders from the My Orders section or contact the ExoCart support team.",
    },

    FAQs: {
      title: "Frequently Asked Questions",
      content:
        "You can find answers about orders, payments, delivery and cancellations here. More detailed FAQs will be added soon.",
    },

    "Shipping Policy": {
      title: "Shipping Policy",
      content:
        "ExoCart aims to deliver your groceries quickly and safely. Delivery availability and timing may vary depending on your location.",
    },

    "Return Policy": {
      title: "Return Policy",
      content:
        "If you receive an incorrect or damaged product, please contact ExoCart support for assistance with your order.",
    },

    "Privacy Policy": {
      title: "Privacy Policy",
      content:
        "ExoCart respects your privacy and uses your information to provide and improve our shopping and delivery services.",
    },

    "Terms & Conditions": {
      title: "Terms & Conditions",
      content:
        "By using ExoCart, you agree to use the platform responsibly and provide accurate information while placing orders.",
    },

    Cookies: {
      title: "Cookie Policy",
      content:
        "ExoCart may use browser storage and similar technologies to provide a better shopping experience.",
    },

    Social: {
      title: "ExoCart Social",
      content:
        "Our social media pages are coming soon. Stay tuned for updates, offers and new arrivals from ExoCart.",
    },
  };

  const handleQuickLink = (item) => {
    switch (item) {
      case "Home":
        navigate("/home");
        break;

      case "Products":
        navigate("/products");
        break;

      case "Categories":
        navigate("/products");
        break;

      case "Wishlist":
        navigate("/wishlist");
        break;

      case "Cart":
        navigate("/cart");
        break;

      default:
        break;
    }
  };

  const handleFooterInfo = (item) => {
    setActiveModal(item);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    toast.success("Subscribed successfully!");
    e.target.reset();
  };

  return (
    <>
      <footer className="bg-[#020817] border-t border-slate-800 text-slate-300">
        <div className="max-w-7xl mx-auto px-6 py-12">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-12 gap-y-10">

            {/* ================= BRAND ================= */}
            <div className="space-y-5">

              <div className="flex items-center gap-3">

                <img
                  src={logo}
                  alt="ExoCart"
                  className="w-10 h-10 mb-2 object-contain"
                />

                <h2 className="text-2xl font-semibold text-white">
                  ExoCart
                </h2>

              </div>

              <p className="text-sm leading-relaxed text-slate-400">
                Your one-stop destination for fresh groceries delivered in
                minutes.
              </p>

              <div className="flex items-center gap-3">

                {socialLinks.map(({ icon: Icon, label }) => (

                  <button
                    key={label}
                    type="button"
                    aria-label={label}
                    onClick={() => handleFooterInfo("Social")}
                    className="
                      h-11
                      w-11
                      flex
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-slate-700
                      bg-[#081225]
                      text-slate-300
                      transition-all
                      duration-300
                      hover:bg-green-500
                      hover:border-green-500
                      hover:text-black
                      hover:-translate-y-1
                      hover:shadow-lg
                      hover:shadow-green-500/30
                      cursor-pointer
                    "
                  >
                    <Icon size={18} />
                  </button>

                ))}

              </div>

            </div>

            {/* ================= COMPANY ================= */}
            <div>

              <h3 className="text-white font-semibold mb-4">
                Company
              </h3>

              <ul className="space-y-3 text-sm">

                {companyLinks.map((item) => (

                  <li key={item}>

                    <button
                      type="button"
                      onClick={() => handleFooterInfo(item)}
                      className="
                        text-slate-400
                        cursor-pointer
                        transition-all
                        duration-200
                        hover:text-green-400
                      "
                    >
                      {item}
                    </button>

                  </li>

                ))}

              </ul>

            </div>

            {/* ================= SUPPORT ================= */}
            <div>

              <h3 className="text-white font-semibold mb-4">
                Customer Support
              </h3>

              <ul className="space-y-3 text-sm">

                {supportLinks.map((item) => (

                  <li key={item}>

                    <button
                      type="button"
                      onClick={() => handleFooterInfo(item)}
                      className="
                        text-slate-400
                        cursor-pointer
                        transition-all
                        duration-200
                        hover:text-green-400
                      "
                    >
                      {item}
                    </button>

                  </li>

                ))}

              </ul>

            </div>

            {/* ================= QUICK LINKS ================= */}
            <div>

              <h3 className="text-white font-semibold mb-4">
                Quick Links
              </h3>

              <ul className="space-y-3 text-sm">

                {quickLinks.map((item) => (

                  <li key={item}>

                    <button
                      type="button"
                      onClick={() => handleQuickLink(item)}
                      className="
                        text-slate-400
                        cursor-pointer
                        transition-all
                        duration-200
                        hover:text-green-400
                      "
                    >
                      {item}
                    </button>

                  </li>

                ))}

              </ul>

            </div>

            {/* ================= NEWSLETTER ================= */}
            <div>

              <h3 className="text-white font-semibold mb-4">
                Stay Updated
              </h3>

              <p className="text-sm text-slate-400 mb-5">
                Subscribe to receive offers and new arrivals.
              </p>

              <form
                onSubmit={handleSubscribe}
                className="space-y-3"
              >

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-[#081225]
                    px-4
                    py-3
                    text-sm
                    text-white
                    placeholder:text-slate-500
                    focus:border-green-500
                    focus:outline-none
                  "
                />

                <button
                  type="submit"
                  className="
                    w-full
                    rounded-xl
                    bg-green-500
                    py-3
                    text-sm
                    font-semibold
                    text-black
                    transition-all
                    duration-300
                    hover:bg-green-400
                    hover:scale-[1.02]
                    cursor-pointer
                  "
                >
                  Subscribe
                </button>

              </form>

            </div>

          </div>

        </div>

        {/* ================= BOTTOM ================= */}
        <div className="border-t border-slate-800">

          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">

            <p>
              © 2026 ExoCart. All rights reserved.
            </p>

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() =>
                  handleFooterInfo("Terms & Conditions")
                }
                className="
                  text-slate-500
                  cursor-pointer
                  transition-all
                  duration-200
                  hover:text-green-400
                "
              >
                Terms & Conditions
              </button>

              <span>|</span>

              <button
                type="button"
                onClick={() =>
                  handleFooterInfo("Privacy Policy")
                }
                className="
                  text-slate-500
                  cursor-pointer
                  transition-all
                  duration-200
                  hover:text-green-400
                "
              >
                Privacy Policy
              </button>

              <span>|</span>

              <button
                type="button"
                onClick={() =>
                  handleFooterInfo("Cookies")
                }
                className="
                  text-slate-500
                  cursor-pointer
                  transition-all
                  duration-200
                  hover:text-green-400
                "
              >
                Cookies
              </button>

            </div>

          </div>

        </div>

      </footer>

      {/* ================= FOOTER DIALOG ================= */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">

          {/* BACKDROP */}
          <div
            className="
              absolute
              inset-0
              bg-black/70
              backdrop-blur-sm
            "
            onClick={() => setActiveModal(null)}
          ></div>

          {/* DIALOG */}
          <div
            className="
              relative
              w-full
              max-w-md
              rounded-2xl
              border
              border-slate-700
              bg-[#081225]
              shadow-2xl
              p-6
            "
          >

            {/* CLOSE */}
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="
                absolute
                top-4
                right-4
                w-8
                h-8
                rounded-lg
                flex
                items-center
                justify-center
                text-slate-400
                hover:text-white
                hover:bg-slate-800
                transition
                cursor-pointer
              "
            >
              <X size={18} />
            </button>

            {/* ICON */}
            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-green-500/10
                border
                border-green-500/20
                flex
                items-center
                justify-center
                mb-4
              "
            >
              <img
                src={logo}
                alt="ExoCart"
                className="w-7 h-7 object-contain"
              />
            </div>

            {/* TITLE */}
            <h2 className="text-xl font-bold text-white pr-8">
              {modalContent[activeModal]?.title}
            </h2>

            {/* CONTENT */}
            <p className="text-sm text-slate-400 leading-relaxed mt-3">
              {modalContent[activeModal]?.content}
            </p>

            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="
                mt-6
                w-full
                rounded-xl
                bg-green-500
                py-2.5
                text-sm
                font-semibold
                text-black
                transition-all
                duration-300
                hover:bg-transparent
                hover:border-green-500
                hover:text-green-400
                border
                border-green-500
                cursor-pointer
              "
            >
              Close
            </button>

          </div>

        </div>
      )}
    </>
  );
}

export default Footer;