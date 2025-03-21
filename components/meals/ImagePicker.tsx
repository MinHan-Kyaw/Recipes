"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ImagePickerProps {
  label: string;
  name: string;
  className?: string;
}

export default function ImagePicker({
  label,
  name,
  className,
}: ImagePickerProps) {
  const [pickedImage, setPickedImage] = useState<string | ArrayBuffer | null>(
    null
  );
  const imageInput = useRef<HTMLInputElement>(null);

  function handlePickClick() {
    if (imageInput.current) {
      imageInput.current.click();
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setPickedImage(null);
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPickedImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>{label}</Label>
      <div className="flex items-start gap-6 mb-4">
        <Card className="w-40 h-40 flex justify-center items-center text-center text-muted-foreground relative overflow-hidden">
          {!pickedImage && <p className="m-0 p-4">No image picked yet.</p>}
          {pickedImage && (
            <Image
              src={pickedImage as string}
              alt="The image selected by the user."
              fill
              className="object-cover"
            />
          )}
        </Card>
        <input
          className="hidden"
          type="file"
          id={name}
          accept="image/png, image/jpeg"
          name={name}
          ref={imageInput}
          onChange={handleImageChange}
          required
        />
        <Button
          type="button"
          onClick={handlePickClick}
          variant="secondary"
          className="hover:text-food-gradient"
        >
          Pick an Image
        </Button>
      </div>
    </div>
  );
}
