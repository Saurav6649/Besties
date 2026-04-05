import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Avatar from "../shared/Avatar";
import Card from "../shared/Card";
import Context from "../../Context";
import { useContext, useEffect, useState } from "react";
import HttpInterceptor from "../lib/HttpInterceptor";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import useSWR, { mutate } from "swr";
import Fetcher from "../lib/Fetcher";
import { Catcherr } from "../lib/CatchError";
import FriendSuggestion from "./friend/FriendSuggestion";
import FriendRequest from "./friend/FriendRequest";
import { useMediaQuery } from "react-responsive";
import Logo from "../shared/logo";
import IconButton from "../shared/Iconbutton";
import FriendsOnline from "./friend/FriendsOnline";

const Layout = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const EightMinInMs = 8 * 60 * 60 * 1000;

  const { error } = useSWR("/auth/refreshToken", Fetcher, {
    refreshInterval: EightMinInMs,
    shouldRetryOnError: false,
  });

  const { session, setSession } = useContext(Context);
  // console.log(session);

  const { pathname } = useLocation();

  const friendsUiBlacklist = [
    "/app/friends",
    "/app/chat",
    "/app/voice-call",
    "/app/video-chat",
  ];

  const isBlacklisted = friendsUiBlacklist.some((path) => pathname === path);

  // console.log("blaclisted", isBlacklisted);

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

  const [leftSidebarWidth, setLeftSidebarWidth] = useState(0);
  const rightSidebarWidth = 250;
  const [collapseWidth, setCollapseWidth] = useState(0);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const width = isMobile ? 0 : 250;
    const collapse = isMobile ? 0 : 100;

    setLeftSidebarWidth(width);
    setCollapseWidth(collapse);
  }, [isMobile]);

  const sidebarStyle = {
    backgroundImage:
      "radial-gradient(circle farthest-corner at 17.6% 50.7%, rgba(25,0,184,1) 0%, rgba(0,0,0,1) 90%)",
  };

  const getPath = (path: string) => {
    const firstPath = path.split("/").pop();
    const finalPath = firstPath?.split("-").join(" ");
    return finalPath;
  };

  const handleProfile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    input.onchange = async () => {
      if (!input.files) return;

      const file = input.files[0];

      const extension = file.type.split("/")[1];
      const path = `profile-pictures/${uuid()}.${extension}`;
      const payload = {
        path,
        type: file.type,
        status: "public-read",
      };
      try {
        const options = {
          headers: {
            "Content-Type": file.type,
          },
        };
        const { data } = await HttpInterceptor.post("/storage/upload", payload);
        await HttpInterceptor.put(data.url, file, options);
        const { data: user } = await HttpInterceptor.put(
          "/auth/profile-picture",
          { path },
        );

        if (!session) return;

        setSession({ ...session, image: user.image });
        mutate("/auth/refreshToken");

        toast.success("Uploaded Successfully");
      } catch (err) {
        console.log(err);
      }
    };
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await HttpInterceptor.post("/auth/logout");
      navigate("/login");
    } catch (err) {
      Catcherr(err);
    }
  };

  useEffect(() => {
    if (error) handleLogout();
  }, [error]);

  return (
    <div className="min-h-screen lg:flex ">
      {/* responsive nav */}
      <nav
        style={sidebarStyle}
        className="lg:hidden p-5 z-[20000] sticky top-0 right-0 w-full flex justify-between"
      >
        <Logo />
        <div className="flex gap-3 items-center">
          <IconButton
            onClick={handleLogout}
            size="md"
            type="danger"
            icon="logout-circle-r-line"
          />
          <Link to={"/app/chat"}>
            <IconButton size="md" type="success" icon="chat-ai-line" />
          </Link>
          <IconButton
            onClick={() =>
              setLeftSidebarWidth(
                leftSidebarWidth === 250 ? collapseWidth : 250,
              )
            }
            size="md"
            type="primary"
            icon="menu-line"
          />
        </div>
      </nav>

      {/* web nav */}
      <aside
        className="h-screen bg-white shadow  lg:rounded-2xl z-[20000] fixed top-0 left-0 lg:p-2 overflow-auto"
        style={{ width: leftSidebarWidth, transition: "0.3s" }}
      >
        <div className="h-full lg:rounded-2xl p-2 " style={sidebarStyle}>
          <div>
            <div>
              {session && (
                <Avatar
                  title={`${
                    leftSidebarWidth === collapseWidth ? "" : session.fullname
                  }`}
                  size={leftSidebarWidth === collapseWidth ? "md" : "lg"}
                  subtitle={`${session.email}`}
                  img={session.image || "/Images/Profile.jpg"}
                  titleColor="#ffffff"
                  subtitleColor="#f5f5f5"
                  onClick={handleProfile}
                />
              )}
            </div>

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

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 fixed bottom-7  px-6 py-2 rounded-full transition-all duration-200  text-gray-200 hover:bg-white/10 hover:text-white"
              >
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
        className="rounded-2xl px-2 py-2 space-y-7"
        style={{
          width: isMobile
            ? "100%"
            : `calc(100% - ${leftSidebarWidth + rightSidebarWidth}px)`,
          marginLeft: isMobile ? 0 : leftSidebarWidth,
          marginRight: rightSidebarWidth,
          transition: "0.3s",
        }}
      >
        {!isBlacklisted && <FriendRequest />}

        <Card
          shadow
          divider
          border
          title={
            <div className="flex gap-3 items-center ">
              <button
                onClick={() =>
                  setLeftSidebarWidth(
                    leftSidebarWidth === 250 ? collapseWidth : 250,
                  )
                }
                className="lg:block hidden w-10 h-10 bg-gray-100 rounded-full cursor-pointer"
              >
                <i className="ri-arrow-left-line"></i>
              </button>
              <h1 className="capitalize">{getPath(pathname)}</h1>
            </div>
          }
        >
          <Outlet />
        </Card>
        {!isBlacklisted && <FriendSuggestion />}
      </section>

      {/* Right Sidebar */}
      <aside
        style={{ width: rightSidebarWidth, transition: "0.2s" }}
        className=" lg:block hidden h-full flex flex-col gap-4  bg-white shadow rounded-2xl fixed top-0 right-0 mt-4 overflow-hidden"
      >
        <FriendsOnline />
      </aside>
    </div>
  );
};

export default Layout;
