import { useEffect, useState } from "react";
import Dashboard from "../../components/admin/Dashboard";
import LayoutContent from "../../components/admin/LayoutContent";
import FrameContent from "../../components/admin/FrameContent";
const navbarList = [
  {
    title: "Dashboard",
    page: Dashboard,
  },
  {
    title: "Photo Layout",
    page: LayoutContent,
  },
  {
    title: "Frame Library",
    page: FrameContent,
  },
  {
    title: "Transactions",
    page: () => <div>Transactions</div>,
  },
  {
    title: "Monthly Reports",
    page: () => <div>Monthly Reports</div>,
  },
  {
    title: "Settings",
    page: () => <div>Settings</div>,
  },
];

export default function AdminPage() {
  const [selectedMenu, setSelectedMenu] = useState<number>(0);
  const CurrentPage = navbarList[selectedMenu].page;
  return (
    <div className="relative w-full h-screen flex bg-black">
      {/* side navbar */}
      <SideBar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
      {/* main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <CurrentPage />
      </main>
    </div>
  );
}

type sideBarProps = {
  selectedMenu: number;
  setSelectedMenu: (selctedMenu: number) => void;
};
function SideBar({ selectedMenu, setSelectedMenu }: sideBarProps) {
  useEffect(() => {
    document.title = "Admin Photo Booth App";
  });
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
            <li
              key={index}
              onClick={() => setSelectedMenu(index)}
              className={`w-full text-[#676666] cursor-pointer 
                ${selectedMenu === index ? "border border-[#C9A84C] bg-[#1E1A12] text-[#C9A84C]" : ""}
             p-2`}
            >
              {item.title}
            </li>
          ))}
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
