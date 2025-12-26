// app/dashboard/new/page.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { createNote } from "@/modules/actions/notes";

export default function CreateNotePage() {
  const [loading, setLoading] = useState(false);

  // Tiptap Editor Setup
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start writing your smart note here...</p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[300px] border p-4 rounded-md",
      },
    },
  });

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    // এডিটরের কন্টেন্ট ফর্মে ম্যানুয়ালি ঢোকানো
    const htmlContent = editor?.getHTML() || "";
    formData.set("content", htmlContent);

    // সার্ভার অ্যাকশন কল করা
    await createNote(formData);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Create New Note 📝</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            name="title"
            placeholder="Note Title (e.g. Project Ideas)"
            required
            className="text-lg font-medium"
          />
        </div>

        {/* Rich Text Editor */}
        <div className="bg-white rounded-lg">
          <EditorContent editor={editor} />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Note"}
          </Button>
        </div>
      </form>
    </div>
  );
}
