import * as React from "react";
import { Upload, X } from "lucide-react";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";

function toSingleFile(value?: File | null) {
  return value ? [value] : [];
}

export function FileDropzoneField({
  value,
  onFileChange,
  emptyLabel,
  helperText,
}: {
  value?: File | null;
  onFileChange: (file?: File) => void;
  emptyLabel: string;
  helperText: string;
}) {
  const [files, setFiles] = React.useState<File[]>(() => toSingleFile(value));

  React.useEffect(() => {
    setFiles(toSingleFile(value));
  }, [value]);

  return (
    <FileUpload
      maxFiles={1}
      maxSize={5 * 1024 * 1024}
      className="w-full min-w-0 max-w-full overflow-hidden"
      value={files}
      onValueChange={(nextFiles) => {
        setFiles(nextFiles);
        onFileChange(nextFiles[0]);
      }}
      multiple={false}
      accept="image/*"
    >
      <FileUploadDropzone className="w-full min-w-0 max-w-full rounded-lg border border-dashed bg-card px-4 py-6">
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <p className="max-w-full break-words text-sm font-medium">{emptyLabel}</p>
          <p className="max-w-full break-words text-xs text-muted-foreground">{helperText}</p>
        </div>
        <FileUploadTrigger asChild>
          <button type="button" className="secondary-button mt-2">
            Browse files
          </button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList>
        {files.map((file) => (
          <FileUploadItem key={`${file.name}-${file.size}`} value={file} className="min-w-0 max-w-full rounded-lg border bg-card p-2">
            <FileUploadItemPreview />
            <FileUploadItemMetadata />
            <FileUploadItemDelete asChild>
              <button type="button" className="rounded-md p-1 hover:text-yellow-500" aria-label="Remove file">
                <X className="size-4" />
              </button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
}
