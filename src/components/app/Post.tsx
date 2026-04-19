import { useState } from "react";
import Card from "../shared/Card";
import { Card as AntCard, message, Skeleton } from "antd";
import Editor from "../shared/Editor";
import IconButton from "../shared/Iconbutton";
import Button from "../shared/Button";
import { Catcherr } from "../lib/CatchError";
import { v4 as uuid } from "uuid";
import HttpInterceptor from "../lib/HttpInterceptor";
import moment from "moment";
import useSWR, { mutate } from "swr";
import Fetcher from "../lib/Fetcher";
const env = import.meta.env;

interface FileDataInterface {
  url: string;
  file: File;
}

const Post = () => {
  const [value, setValue] = useState("");
  const [fileData, setFileData] = useState<FileDataInterface | null>(null);

  const { data, isLoading, error } = useSWR("/post", Fetcher);

  const handleAttach = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*, video/*";
    input.click();

    input.onchange = () => {
      if (!input.files) return;

      const file = input.files[0];
      const url = URL.createObjectURL(file);
      console.log(url);

      setFileData({ url, file: file });
      console.log(file);
    };
  };

  const handlePost = async () => {
    let path = null;
    try {
      if (!value && !fileData) {
        return message.error("Post cannot be empty");
      }

      if (fileData) {
        const ext = fileData?.file.name.split(".").pop();

        const filename = `${uuid()}.${ext}`;
        path = `Post/${filename}`;

        const payload = {
          path,
          status: "public-read",
          type: fileData?.file.type,
        };

        const option = {
          headers: {
            "Content-Type": fileData?.file.type,
          },
        };

        const { data } = await HttpInterceptor.post("/storage/upload", payload);
        await HttpInterceptor.put(data.url, fileData?.file, option);
      }
      console.log("Success");

      const formData = {
        attachment: path,
        type: path ? fileData?.file.type : null,
        content: value,
      };

      console.log("formData", formData);

      await HttpInterceptor.post("/post", formData);
      mutate("/post");
      message.success("Post Uploaded Successfully");
      setFileData(null);
      setValue("");
    } catch (err) {
      Catcherr(err);
    }
  };

  console.log("fetch data", data);

  return (
    <div className="h-[520px] overflow-auto space-y-6 scrollbar-hide">
      <div className="flex flex-col gap-5">
        {value.length === 0 && (
          <h1 className="font-semibold text-black text-lg">
            Write Your Text Here
          </h1>
        )}
        {(value.length > 0 || fileData?.url) && (
          <AntCard>
            {fileData && fileData.file.type.startsWith("image/") && (
              <img
                src={fileData?.url}
                alt=""
                className="object-cover rounded-lg"
              />
            )}
            {fileData && fileData.file.type.startsWith("video/") && (
              <video
                src={fileData?.url}
                controls
                className="object-cover rounded-lg"
              />
            )}
            <div
              dangerouslySetInnerHTML={{ __html: value }}
              className="hard-reset"
            />
            <label htmlFor="">{moment().format("MMM DD , hh:mm A")}</label>
          </AntCard>
        )}

        <Editor value={value} onChange={setValue} />
        <div className="flex gap-3 items-center">
          <Button onClick={handleAttach} type="danger" icon="attachment-line">
            Attach
          </Button>
          {fileData && (
            <Button onClick={() => setFileData(null)} type="warning">
              Reset
            </Button>
          )}
          <Button onClick={handlePost} type="secondary" icon="send-plane-fill">
            Post
          </Button>
        </div>
      </div>

      {isLoading && <Skeleton active />}

      {error && (
        <h1 className="font-semibold text-red-500 text-lg ">{error.message}</h1>
      )}

      {data &&
        data.map((item: any) => (
          <Card shadow border>
            <div className="space-y-4 pb-2">
              {item.attachment && item.type.startsWith("image/") && (
                <img
                  src={`${env.VITE_S3_URL}/${item.attachment}`}
                  alt=""
                  className="object-cover rounded-lg"
                />
              )}
              {item.attachment && item.type.startsWith("video/") && (
                <video
                  src={`${env.VITE_S3_URL}/${item.attachment}`}
                  controls
                  className="object-cover rounded-lg"
                />
              )}

              <div
                dangerouslySetInnerHTML={{ __html: item.content }}
                className="hard-reset"
              />
              <div className="flex justify-between items-center">
                <p>{moment().format("MMM DD,hh mm A")}</p>
                <div className="flex items-center gap-2">
                  <IconButton
                    size="md"
                    type="success"
                    icon="edit-fill"
                  ></IconButton>
                  <IconButton
                    size="md"
                    type="danger"
                    icon="delete-bin-4-line"
                  ></IconButton>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <IconButton size="md" type="primary" icon="thumb-up-line">
                  20K
                </IconButton>
                <IconButton size="md" type="secondary" icon="thumb-down-line">
                  20K
                </IconButton>
                <IconButton size="md" type="danger" icon="chat-ai-line">
                  20K
                </IconButton>
              </div>
            </div>
          </Card>
        ))}
    </div>
  );
};

export default Post;
