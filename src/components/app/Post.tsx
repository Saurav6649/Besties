import Card from "../shared/Card";
import IconButton from "../shared/Iconbutton";

const Post = () => {
  return (
    <div className="h-[520px] overflow-auto space-y-6 scrollbar-hide">
      {Array(20)
        .fill(0)
        .map((item, index) => (
          <div key={index}>
            <Card shadow border>
              <div className="space-y-4 pb-2">
                <p className="font-regular text-gray-700">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure
                  voluptatum est molestiae aliquid, quod totam.Lorem ipsum dolor
                  sit amet, consectetur adipisicing elit. Iure voluptatum est
                  molestiae aliquid, quod totam.Lorem ipsum dolor sit amet,
                  consectetur adipisicing elit. Iure voluptatum est molestiae
                  aliquid, quod totam.
                </p>
                <div className="flex justify-between items-center">
                  <p>Jan 2, 2030 07:30 Pm</p>
                  <div className="flex items-center gap-2">
                    <IconButton size="md" type="success" icon="edit-fill"></IconButton>
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
          </div>
        ))}
    </div>
  );
};

export default Post;
