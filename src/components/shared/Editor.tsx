import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import type { FC } from "react";

const toolbar: string[] = [
  "heading",
  "|",
  "bold",
  "italic",
  "|",
  "numberedList",
  "bulletedList",
  "|",
  "undo",
  "redo",
];

interface EditorInterface {
  value: string;
  onChange: (v: any) => void;
}

const Editor: FC<EditorInterface> = ({ value, onChange }) => {
  const handleChange = (_: any, editor: any) => {
    // ynha pe '_' means koi data ni hai data hai acutally me editor me
    const v = editor.getData(); // here we actually recover the data
    onChange(v);
  };

  return (
    <CKEditor
      editor={ClassicEditor as any}
      config={{ toolbar: toolbar }}
      data={value}
      onChange={handleChange}
    />
  );
};

export default Editor;
