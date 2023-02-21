import Pusher from "pusher";

const connectToPusher = () => {
  // Add pusher for real time updates
  return new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_APP_KEY!,
    secret: process.env.PUSHER_APP_SECRET!,
    cluster: "eu",
    useTLS: true
  });
};

export default connectToPusher;