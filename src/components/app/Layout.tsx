import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import Avatar from "../shared/Avatar";
import Card from "../shared/Card";
import { useState } from "react";

const Layout = () => {
  const { pathname } = useLocation();
  const menus = [
    {
      icon: "ri-home-3-line",
      href: "/app",
      label: "Dashboard",
      end: true,
    },
    {
      icon: "ri-chat-smile-line",
      href: "/app/posts",
      label: "My Post",
    },
    {
      icon: "ri-group-line",
      href: "/app/friends",
      label: "Friends",
    },
  ];

  const [leftSidebarWidth, setLeftSidebarWidth] = useState(250);
  const rightSidebarWidth = 250;
  const collapseWidth = 100;

  const sidebarStyle = {
    backgroundImage:
      "radial-gradient(circle farthest-corner at 17.6% 50.7%, rgba(25,0,184,1) 0%, rgba(0,0,0,1) 90%)",
  };

  const getPath = (path: string) => {
    const firstPath = path.split("/").pop();
    const finalPath = firstPath?.split("-").join(" ");
    return finalPath;
  };

  return (
    <div className="min-h-screen flex ">
      <aside
        className="h-screen bg-white shadow  rounded-2xl fixed top-0 left-0 p-2 overflow-auto"
        style={{ width: leftSidebarWidth, transition: "0.3s" }}
      >
        <div className="h-full rounded-2xl p-2 " style={sidebarStyle}>
          <div>
            <Avatar
              title={`${leftSidebarWidth === collapseWidth ? "" : "Saurav"}`}
              size={`${leftSidebarWidth === collapseWidth ? "md" : "lg"}`}
              subtitle="FullStack Developer "
              img="/Images/Profile.jpg"
              titleColor="#ffffff"
              subtitleColor="#f5f5f5"
            />

            <div className="flex flex-col gap-6 mt-10">
              {menus.map((item) => (
                <NavLink
                  to={item.href}
                  key={item.href}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-2 rounded-full transition-all duration-200 
                    ${
                      isActive
                        ? "bg-white/20 text-white font-semibold shadow-sm" // active = slightly transparent white background
                        : "text-gray-200 hover:bg-white/10 hover:text-white" // normal = light gray text + soft hover
                    }`
                  }
                >
                  <i className={`${item.icon} text-lg`} title={item.label}></i>
                  <p
                    className={`text-sm ${
                      leftSidebarWidth === collapseWidth ? "hidden" : ""
                    }`}
                  >
                    {item.label}
                  </p>
                </NavLink>
              ))}

              <button className="flex items-center gap-3 fixed bottom-7  px-6 py-2 rounded-full transition-all duration-200  text-gray-200 hover:bg-white/10 hover:text-white">
                <i className={`ri-logout-circle-r-line text-lg`}></i>
                <p
                  className={`text-sm ${
                    leftSidebarWidth === collapseWidth ? "hidden" : ""
                  }`}
                >
                  Logout
                </p>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Section */}

      <section
        className="rounded-2xl  min-h-screen px-2 py-2 "
        style={{
          width: `calc(100% - ${leftSidebarWidth + rightSidebarWidth}px)`,
          marginLeft: leftSidebarWidth,
          marginRight: rightSidebarWidth,
          transition: "0.3s",
        }}
      >
        <Card
          shadow
          divider
          title={
            <div className="flex gap-3 items-center ">
              <button
                onClick={() =>
                  setLeftSidebarWidth(
                    leftSidebarWidth === 250 ? collapseWidth : 250,
                  )
                }
                className="w-10 h-10 bg-gray-100 rounded-full cursor-pointer"
              >
                <i className="ri-arrow-left-line"></i>
              </button>
              <h1 className="capitalize">{getPath(pathname)}</h1>
            </div>
          }
        >
          <Outlet />
        </Card>
      </section>

      {/* Right Sidebar */}
      <aside className="h-[590px] flex flex-col gap-4  bg-white shadow w-[250px] rounded-2xl fixed top-0 right-0 mt-4 ">
        {/* Top card — Suggested */}
        <div className="w-full border border-gray-100 rounded-lg h-[200px] overflow-auto scrollbar-hide">
          <Card title="Suggested">
            <div className="space-y-5">
              {Array(10)
                .fill(0)
                .map((item, index) => (
                  <div
                    key={index}
                    className="flex  bg-gray-100 rounded  px-3 py-2 items-start"
                  >
                    <Avatar
                      img="/Images/Profile.jpg"
                      titleColor="black"
                      title="Saurav Kumar"
                      subtitle={
                        <div>
                          <button className="bg-green-500 font-medium mt-1 hover:bg-green-400 text-xs text-white px-3 py-1.5 rounded">
                            <i className="ri-user-add-line mr-1"></i>
                            Add Friend
                          </button>
                        </div>
                      }
                    />
                  </div>
                ))}
            </div>
          </Card>
        </div>

        {/* Bottom card — Add Friends */}
        <div className="flex-1 overflow-auto scrollbar-hide">
          <Card title="Add Friends" border>
            <div className="space-y-3">
              {Array(10)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 gap-3 flex justify-start p-2"
                  >
                    <Avatar
                      img="/Images/Profile.jpg"
                      size="md"
                      titleColor="black"
                      title="Saurav Kumar"
                      subtitle="offline"
                      subtitleColor="gray"
                    />
                    <div className="space-x-2">
                      <Link to={"/app/chat"}>
                        <button title="Chat" className="cursor-pointer">
                          <i className="ri-chat-ai-line text-blue-400 hover:text-blue-500 text-[14px]"></i>
                        </button>
                      </Link>
                      <Link to={"/app/voice-call"}>
                        <button title="Phone" className="cursor-pointer">
                          <i className="ri-phone-line text-green-400 hover:text-green-500 text-[14px]"></i>
                        </button>
                      </Link>
                      <Link to={"/app/video-chat"}>
                        <button title="Video Call" className="cursor-pointer">
                          <i className="ri-video-on-ai-line text-amber-400 hover:text-amber-500 text-[14px]"></i>
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </aside>
    </div>
  );
};

export default Layout;
