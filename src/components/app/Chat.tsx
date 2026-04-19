import {
  useContext,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import Avatar from "../shared/Avatar";
import Button from "../shared/Button";
import Form from "../shared/Form";
import Input from "../shared/Input";
import Context from "../../Context";
import { useParams } from "react-router-dom";
import socket from "../lib/socket";
import useSWR from "swr";
import Fetcher from "../lib/Fetcher";
import { Catcherr } from "../lib/CatchError";
import { v4 as uuid } from "uuid";
import HttpInterceptor from "../lib/HttpInterceptor";
import moment from "moment";
import SmallButton from "../shared/SmallButton";

interface messageRecievedInterface {
  from: string;
  message: string;
}

interface fileInterface {
  file: {
    path: string;
    type: string;
  };
}

const AttachmentUi = ({ file }: fileInterface) => {
  if (file.type.startsWith("video/")) {
    return (
      <video className="w-full h-[350px]" controls src={file.path}>
        heelo
      </video>
    );
  }

  if (file.type.startsWith("image/")) {
    return <img className="w-full h-[350px]" src={file.path} />;
  }
};
const Chat = () => {
  const [chat, setChat] = useState<any>([]);
  const { session } = useContext(Context);
  const { id } = useParams();

  const { data } = useSWR(id ? `/chat/${id}` : null, id ? Fetcher : null);

  // console.log("SWR DATA:", data);

  const messageHandler = (messageRecieved: messageRecievedInterface) => {
    console.log("SOCKET MESSAGE:", messageRecieved);
    setChat((prev) => [...prev, messageRecieved]);
  };

  const attachmentHandler = (x: any) => {
    // setChat((prev: any) => [...prev, messageRecieved]);
    console.log(x);
  };

  const chatContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("message", messageHandler);
    socket.on("attachment", attachmentHandler);

    return () => {
      socket.off("message", messageHandler);
      socket.off("attachment", attachmentHandler);
    };
  }, []);

  useEffect(() => {
    if (data) setChat(data);
  }, [data]);

  useEffect(() => {
    const chatdiv = chatContainer.current;

    if (chatdiv) {
      chatdiv.scrollTop = chatdiv.scrollHeight;
    }
  }, [chat]);

  // console.log("chat", chat);

  const sendMessage = (values: any) => {
    if (!session) return;

    const payload = {
      from: session,
      to: id,
      message: values.message,
    };
    setChat((prev: any) => [...prev, payload]);
    socket.emit("message", payload);
  };

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const input = e.target;

      if (!input.files) return;

      const file = input.files[0];
      const url = URL.createObjectURL(file);
      console.log(url);

      const ext = file.name.split(".").pop();
      const filename = `${uuid()}.${ext}`;
      const path = `chat/${filename}`;
      // const type = file.type

      const payload = {
        path,
        type: file.type,
        status: "private",
      };

      const option = {
        headers: {
          "Content-Type": file.type,
        },
      };

      const { data } = await HttpInterceptor.post("/storage/upload", payload);
      await HttpInterceptor.put(data.url, file, option);

      const remoteMetaData = {
        file: {
          path: path,
          type: file.type,
        },
      };

      const localMetaData = {
        file: {
          path: url,
          type: file.type,
        },
      };

      const attachmentMetaData = {
        from: session,
        to: id,
        message: filename,
      };

      setChat((prev: any) => [
        ...prev,
        { ...attachmentMetaData, ...localMetaData },
      ]);
      socket.emit("attachment", { ...attachmentMetaData, ...remoteMetaData });
    } catch (err) {
      Catcherr(err);
    }
  };

  const handleDownload = async (filename: string) => {
    try {
      const path = `chat/${filename}`;
      console.log(path);
      // return;

      const { data } = await HttpInterceptor.post("/storage/download", {
        path,
      });
      const a = document.createElement("a");
      a.href = data.url;
      a.download = filename;
      a.click();
      a.remove();
    } catch (err: any) {
      console.log(err);
      alert(err);
    }
  };

  return (
    <div className="relative flex flex-col h-[85vh] bg-white">
      {/* Messages Section */}
      <div
        className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide"
        ref={chatContainer}
      >
        {chat.map((item: any, index: number) => (
          <div className="space-y-12" key={index}>
            {item.from.id === session?.id || item.from._id === session?.id ? (
              <div className="flex gap-4 items-start">
                <Avatar img={session?.image || "/images/avt.avif"} size="md" />
                <div className=" flex flex-col gap-2 relative bg-rose-50 px-4 py-2 rounded-lg flex-1 text-pink-500 border border-rose-100">
                  <h1 className="font-medium text-black capitalize">You</h1>

                  {item.file && <AttachmentUi file={item.file} />}

                  <div className="flex items-center justify-between">
                    <label>{item.message}</label>

                    {item.file && (
                      <div>
                        <SmallButton
                          onClick={() => handleDownload(item.message)}
                          type="warning"
                          icon="download-line"
                        ></SmallButton>
                      </div>
                    )}
                  </div>

                  <div className="text-gray-500 text-right text-xs">
                    {" "}
                    {moment().format("MMM DD, YYYY hh:mm:ss A")}
                  </div>

                  <i className="ri-arrow-left-s-fill absolute top-0 -left-5 text-4xl text-rose-50"></i>
                </div>
              </div>
            ) : (
              <div className="flex gap-4 items-start">
                <div className=" flex flex-col gap-2 relative bg-violet-50 px-4 py-2 rounded-lg flex-1 text-blue-500 border border-violet-100">
                  <h1 className="font-medium text-black capitalize">
                    {item.from.fullname}
                  </h1>

                  {item.file && <AttachmentUi file={item.file} />}

                  <div className="flex items-center justify-between">
                    <label>{item.message}</label>

                    {item.file && (
                      <div>
                        <SmallButton
                          onClick={() => handleDownload(item.message)}
                          type="secondary"
                          icon="download-line"
                        >
                          Download
                        </SmallButton>
                      </div>
                    )}
                  </div>

                  <div className="text-gray-500 text-right text-xs">
                    {" "}
                    {moment().format("MMM DD, YYYY hh:mm:ss A")}
                  </div>

                  <i className="ri-arrow-right-s-fill absolute top-0 -right-5 text-4xl text-violet-50"></i>
                </div>
                <Avatar img={item.from.image || "/images/avt.avif"} size="md" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="sticky bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 flex gap-2">
        <Form form className="w-full flex items-center gap-4" onValue={sendMessage}>
          <Input name="message" placeholder="Type a message..." />
          <Button icon="send-plane-fill">Send</Button>
        </Form>
        <button className="relative h-11 w-11 rounded-full bg-violet-100 group hover:bg-violet-400">
          <i className="ri-attachment-2 text-violet-500 group-hover:text-white "></i>
          <input
            onChange={handleFile}
            type="file"
            className=" cursor-pointer absolute top-0 left-0 w-full h-full rounded-full opacity-0"
          />
        </button>
      </div>
    </div>
  );
};

export default Chat;
