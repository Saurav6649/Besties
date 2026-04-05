import Avatar from "../shared/Avatar";
import Button from "../shared/Button";
import Form from "../shared/Form";
import Input from "../shared/Input";

const Chat = () => {
  const messages = [
    {
      id: 1,
      sender: "other",
      name: "Saurav Babu",
      text: "Hey bhai, kya haal hai?",
    },
    { id: 2, sender: "me", name: "You", text: "Sab badhiya! Tu bata?" },
    {
      id: 3,
      sender: "other",
      name: "Saurav Babu",
      text: "Project chal raha hai kya?",
    },
    {
      id: 3,
      sender: "other",
      name: "Saurav Babu",
      text: "Project chal raha hai kya?",
    },
    {
      id: 3,
      sender: "other",
      name: "Saurav Babu",
      text: "Project chal raha hai kya?",
    },
    {
      id: 3,
      sender: "other",
      name: "Saurav Babu",
      text: "Project chal raha hai kya?",
    },
    {
      id: 3,
      sender: "other",
      name: "Saurav Babu",
      text: "Project chal raha hai kya?",
    },
    {
      id: 3,
      sender: "other",
      name: "Saurav Babu",
      text: "Project chal raha hai kya?",
    },
    {
      id: 3,
      sender: "other",
      name: "Saurav Babu",
      text: "Project chal raha hai kya?",
    },
    {
      id: 3,
      sender: "other",
      name: "Saurav Babu",
      text: "Project chal raha hai kya?",
    },
    {
      id: 3,
      sender: "other",
      name: "Saurav Babu",
      text: "Project chal raha hai kya?",
    },
    {
      id: 3,
      sender: "other",
      name: "Saurav Babu",
      text: "Project chal raha hai kya?",
    },
    {
      id: 3,
      sender: "other",
      name: "Saurav Babu",
      text: "Project chal raha hai kya?",
    },
    {
      id: 3,
      sender: "other",
      name: "Saurav Babu",
      text: "Project chal raha hai kya?",
    },
    {
      id: 3,
      sender: "other",
      name: "Saurav Babu",
      text: "Project chal raha hai kya?",
    },
    {
      id: 3,
      sender: "other",
      name: "Saurav Babu",
      text: "Project chal raha hai kya?",
    },
  ];

  return (
    <div className="relative flex flex-col h-[85vh] bg-white">
      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 items-end ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "other" && (
              <Avatar img="/Images/Profile.jpg" size="md" />
            )}

            <div
              className={`relative rounded-lg p-3 max-w-[70%] ${
                msg.sender === "me"
                  ? "bg-violet-500 text-white border border-violet-400"
                  : "bg-violet-100 text-violet-700 border border-violet-200"
              }`}
            >
              <h1 className="font-medium text-[13px]">{msg.name}</h1>
              <p className="text-[14px]">{msg.text}</p>

              {msg.sender === "me" ? (
                <i className="ri-arrow-right-s-fill text-2xl text-violet-500 absolute bottom-0 -right-4"></i>
              ) : (
                <i className="ri-arrow-left-s-fill text-2xl text-violet-200 absolute bottom-0 -left-4"></i>
              )}
            </div>

            {msg.sender === "me" && (
              <Avatar img="/Images/Profile.jpg" size="md" />
            )}
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="sticky bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 flex gap-2">
        <Form className="w-full flex items-center gap-4">
          <Input name="message" placeholder="Type a message..." />
          <Button icon="send-plane-fill">Send</Button>
        </Form>
        <button className="h-10 w-12 rounded-full bg-violet-100 group hover:bg-violet-400">
          <i className="ri-attachment-2 text-violet-500 group-hover:text-white "></i>
        </button>
      </div>
    </div>
  );
};

export default Chat;
