import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { TINYMCE_API } from "../../constants/config";

export default function TinyMCEditor(props) {
  return (
    <Editor
      apiKey={TINYMCE_API}
      initialValue={props.defaultValue || ""}
      init={{
        toolbar: "numlist bullist codesample preview table",
        plugins:
          "lists advlist codesample wordcount image link code preview table",
        height: 380,
      }}
      onEditorChange={props.onEditorChange}
    />
  );
}
