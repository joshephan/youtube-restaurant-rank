import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useSupabase } from "@/hooks/useSupabase";
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
  const { id, supabase } = useSupabase();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      await uploadImage(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `/${id}/${uuidv4()}.${fileExt}`;
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
        .remove([`${id}/${formerImageName}`]);

      if (error) {
        console.error("Error deleting former image:", error);
      }
    }
  };

  useEffect(() => {
    if (initialImageSrc) {
      setImageSrc(initialImageSrc);
    }
  }, [initialImageSrc]);

  return (
    <div className="mt-4 w-full max-w-72">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-4 text-center cursor-pointer ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>이미지를 이곳에 두세요 ...</p>
        ) : (
          <p>이미지 업로드</p>
        )}
      </div>
      {imageSrc && (
        <div className="mt-4">
          <img src={imageSrc} alt="Uploaded" className="max-w-full h-auto" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
