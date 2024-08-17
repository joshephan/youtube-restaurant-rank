import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useSupabase } from "@/utils/hooks/useSupabase";
import { v4 as uuidv4 } from "uuid";

interface ImageUploadProps {
  onImageChange: (url: string) => void;
  initialImageSrc?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageChange,
  initialImageSrc,
}) => {
  const [imageSrc, setImageSrc] = useState<string>(initialImageSrc || "");
  const [urlInput, setUrlInput] = useState<string>("");
  const { supabase } = useSupabase();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      await uploadImage(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, file);

    if (error || !data) {
      console.error("Error uploading image:", error);
      return;
    }
    
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(fileName);

    if (imageSrc) {
      await deleteFormerImage();
    }

    setImageSrc(publicUrl);
    onImageChange(publicUrl);
  };

  const deleteFormerImage = async () => {
    const formerImageName = imageSrc.split("/").pop();
    if (formerImageName) {
      const { error } = await supabase.storage
        .from("images")
        .remove([formerImageName]);

      if (error) {
        console.error("Error deleting former image:", error);
      }
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput) {
      if (imageSrc) {
        await deleteFormerImage();
      }
      setImageSrc(urlInput);
      onImageChange(urlInput);
      setUrlInput("");
    }
  };

  return (
    <div className="mt-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-4 text-center cursor-pointer ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here ...</p>
        ) : (
          <p>Drag 'n' drop an image here, or click to select one</p>
        )}
      </div>
      <form onSubmit={handleUrlSubmit} className="mt-4">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Or enter image URL here"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit URL
        </button>
      </form>
      {imageSrc && (
        <div className="mt-4">
          <img src={imageSrc} alt="Uploaded" className="max-w-full h-auto" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
