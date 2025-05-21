
import { useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

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
          "relative rounded-lg border-2 border-dashed transition-all cursor-pointer overflow-hidden",
          dragActive
            ? "border-blue-400 bg-blue-500/10"
            : "border-muted-foreground/25 hover:border-blue-400/50",
          preview ? "p-2 border-blue-400/30" : "p-12"
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
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        {preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain rounded-md max-h-[300px]"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <div className="text-white text-center">
                <Upload className="h-8 w-8 mx-auto mb-2" />
                <p>Upload a different image</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Upload
                  className={cn(
                    "h-8 w-8 transition-colors",
                    dragActive ? "text-blue-300" : "text-muted-foreground/60"
                  )}
                />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xl font-medium text-white">
                Drop your symptom image here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse from your device
              </p>
              <p className="text-xs text-blue-300/70 pt-2">
                For best results, use a clear, well-lit photo to help with assessment
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
