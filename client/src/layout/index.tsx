import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import { useSpring, a } from "@react-spring/web";
import { PUSHER_KEY } from "../data/backend-config";
import store, { storeType } from "../../redux/configureStore";
import {
  connectPusher,
  disconnectPusher,
} from "../../redux/actions/pusherActions";
import bindChannelEvents from "./pusher/channel";
import SideBar from "./sidebar";
import Navigation from "./navigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const currentUser = useSelector((store: storeType) => store.currentUser);

  const [expandNav, setExpandNav] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (
      !currentUser.user &&
      !currentUser.loading &&
      !currentUser.method.validate
    ) {
      router.replace("/login?redirected=true");
    }
  }, [currentUser]);

  // Connect to pusher when user logs in
  useEffect(() => {
    if (currentUser.user?._id && !currentUser.loading) {
      const pusher = new Pusher(PUSHER_KEY, { cluster: "eu" });

      pusher.connection.bind("connected", () => {
        const channel = pusher.subscribe("bug-tracker");
        bindChannelEvents(channel);

        store.dispatch(connectPusher(pusher.connection.socket_id));
      });

      return () => {
        store.dispatch(disconnectPusher());
        pusher.disconnect();
      };
    }
  }, [currentUser.user?._id]);

  const spring = useSpring({
    opacity: notificationOpen ? 0.75 : 1,
    config: {
      tension: 800,
      friction: 50,
    },
  });

  return (
    <a.div
      className="flex flex-col min-h-screen isolate"
      style={{
        ...spring,
        transformOrigin: "center",
      }}
    >
      <Navigation
        notificationOpen={notificationOpen}
        setNotificationOpen={setNotificationOpen}
      />
      <div className="flex-1 flex flex-col lg:flex-row-reverse lg:relative mt-16 mb-[60px] lg:mb-0">
        <main
          className={`text-gray-300 font-open flex-1 ${
            expandNav ? "lg:ml-36" : "lg:ml-[60px]"
          } transition-all`}
        >
          {children}
        </main>
        <SideBar expandNav={expandNav} setExpandNav={setExpandNav} />
      </div>
    </a.div>
  );
};

export default Layout;
