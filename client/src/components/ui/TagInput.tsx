"use client";

import { Dispatch, SetStateAction, useId, useState } from "react";
import { Tag, TagInput } from "emblor";

export default function TagInputComponent({
  tags,
  setTags,
}: {
  tags: Tag[];
  setTags: Dispatch<SetStateAction<Tag[]>>;
}) {
  const id = useId();
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  return (
    <div className="*:not-first:mt-2 mt-4">
      <TagInput
        id={id}
        tags={tags}
        setTags={setTags}
        placeholder="Add a tag"
        styleClasses={{
          tagList: {
            container: "gap-1",
          },
          input:
            "rounded-md transition-[color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-ring outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          tag: {
            body: "relative h-7 bg-blue-100 text-blue-700 border border-input hover:bg-blue-200 rounded-full font-medium text-xs ps-2 pe-7",
            closeButton:
              "absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
          },
        }}
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
        inlineTags={false}
        inputFieldPosition="top"
      />
    </div>
  );
}
