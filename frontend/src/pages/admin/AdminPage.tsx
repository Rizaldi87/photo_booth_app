import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
const navbarList = [
  {
    title: "Dashboard",
    page: ".",
  },
  {
    title: "Photo Layout",
    page: "layout",
  },
  {
    title: "Frame Library",
    page: "frames",
  },
  {
    title: "Transactions",
    page: "transactions",
  },
  {
    title: "Monthly Reports",
    page: "reports",
  },
  {
    title: "Settings",
    page: "settings",
  },
];

export default function AdminPage() {
  return (
    <div className="relative w-full h-screen flex bg-black">
      {/* side navbar */}
      <SideBar />
      {/* main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

function SideBar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Admin Photo Booth App";
  }, []);
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <div className="w-64 shrink-0 h-full bg-[#111111] border-r border-[#292929] flex flex-col items-center">
      <div className="w-full p-6 py-12 border-b border-[#292929] font-mono">
        <span className="text-[#C9A84C] text-xl ">MyPixelBooth</span>
        <br />
        <span className="text-[#555250] text-xs">ADMIN CONSOLE</span>
      </div>
      <div className="w-full h-full p-6 py-12 border-b border-[#292929] font-mono">
        <ul className="flex flex-col items-center gap-1">
          {navbarList.map((item, index) => (
            <NavLink
              key={index}
              to={item.page}
              end={item.page === "."}
              className={({ isActive }) => `w-full text-[#676666] cursor-pointer 
                ${isActive ? "border border-[#C9A84C] bg-[#1E1A12] text-[#C9A84C]" : ""}
             p-2`}
              preventScrollReset
            >
              {item.title}
            </NavLink>
          ))}
          <div className="w-full p-6 py-8 font-mono border-t border-[#292929] mt-auto">
            <span className="text-xs text-[#363636]">Logged in as</span>
            <br />
            <span className="text-sm text-[#555250]">{user?.email || "admin@pixelbooth.id"}</span>
            <button onClick={handleLogout} className="mt-3 w-full text-left text-xs text-[#676666] hover:text-[#C9A84C] cursor-pointer">
              → Logout
            </button>
          </div>
        </ul>
      </div>
      <div className="w-full p-6 py-12 font-mono">
        <span className="text-xs text-[#363636]">Logged in as</span>
        <br />
        <span className="text-sm text-[#555250]">admin@pixelbooth.id</span>
      </div>
    </div>
  );
}
