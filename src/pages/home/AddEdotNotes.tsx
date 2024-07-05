import React, { Key, useState } from "react";
import TagInput from "../../components/TagInput/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

interface AddEditNotesProps {
  onClose: () => void;
  noteData?: { _id: Key; title: string; content: string; tags: string[] };
  type: "add" | "edit";
  getAllNotes: any;
}

const AddEditNotes: React.FC<AddEditNotesProps> = ({
  noteData,
  type,
  getAllNotes,
  onClose,
}) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState<string[]>(noteData?.tags || []);

  const [err, setErr] = useState<string | null>(null);

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });
      if (response.data && response.data.note) {
        getAllNotes();
        onClose();
        toast.success("Note Added")
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        setErr(error?.response?.data?.message);
      }
    }
  };

  const editNote = async () => {
    try {
      const noteId = noteData?._id;
      const response = await axiosInstance.put(`/edit-note/${noteId}`, {
        title,
        content,
        tags,
      });
      if (response.data && response.data.note) {
        getAllNotes();
        toast("Note Updated", {
          icon: "🔃",
        });
        onClose();
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        setErr(error?.response?.data?.message);
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setErr("Please enter a valid title.");
      return;
    }

    if (!content) {
      setErr("Please enter content.");
      return;
    }

    setErr(null);

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-200"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>
      <div className="flex flex-col gap-2">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none bg-slate-50"
          placeholder="Go to Gym"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENT</label>
        <textarea
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        ></textarea>
      </div>
      <div className="mt-4">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {err && <p className="text-red-500 text-xs pt-4">{err}</p>}

      <button
        className="btn btn-primary font-medium mt-5 p-3 w-full"
        onClick={handleAddNote}
      >
        {type === "add" ? "ADD" : "UPDATE"}
      </button>
    </div>
  );
};

export default AddEditNotes;
