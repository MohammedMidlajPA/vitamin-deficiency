
import { useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
}

export const ImageUpload = ({ onImageSelect }: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageSelect(file);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className={cn(
          "relative rounded-lg border-2 border-dashed p-12 text-center transition-all",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50",
          preview ? "p-2" : "p-12"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-contain rounded-md"
          />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Upload
                className={cn(
                  "h-12 w-12 transition-colors",
                  dragActive ? "text-primary" : "text-muted-foreground/60"
                )}
              />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-medium">
                Drop your image here or click to upload
              </p>
              <p className="text-sm text-muted-foreground">
                Supports JPG, PNG and WEBP
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
