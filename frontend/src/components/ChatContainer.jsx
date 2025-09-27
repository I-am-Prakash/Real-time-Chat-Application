import { useChatStore } from "../store/chatStore";
import { useEffect } from "react";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } =
    useChatStore();

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);

  if (isMessagesLoading) return <div>Loading</div>;
  return <div></div>;
};

export default ChatContainer;
