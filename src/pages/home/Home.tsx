import { Key, useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/NoteCard/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEdotNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

interface NoteData {
  createdOn: string;
  _id: Key;
  title: string;
  content: string;
  tags: string[];
  date: string;
  isPinned: boolean;
}

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [openAddEditModal, setAddEditModal] = useState<{
    isShown: boolean;
    type: "add" | "edit";
    data: NoteData | null;
  }>({
    isShown: false,
    type: "add",
    data: null,
  });

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");

      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
        console.log(response.data.user);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");

      if (response.data && response.data.notes) {
        setNotes(response.data.notes);
      }
    } catch (error) {
      console.log("unexpected error");
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllNotes();
    return () => {};
  }, []);

  const handleEdit = (note: NoteData) => {
    setAddEditModal({ isShown: true, type: "edit", data: note });
  };

  const handleDelete = async (id: Key) => {
    try {
      const response = await axiosInstance.delete(`/delete-note/${id}`);
      if (response?.data?.message) {
        getAllNotes();
        toast("Note Deleted", {
          icon: "🚮",
        });
      }
    } catch (error) {
      console.log("error in pinning note");
    }
  };

  const handlePinNote = async (id: Key) => {
    try {
      const response = await axiosInstance.put(`/pin-note/${id}`);
      if (response?.data?.message) {
        getAllNotes();
      }
    } catch (error) {
      console.log("error in pinning note");
    }
  };

  const closeModal = () => {
    setAddEditModal({ isShown: false, type: "add", data: null });
  };

  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-4 mt-8">
          {notes.length < 1 ? (
            <p>Add Notes to Display here!</p>
          ) : (
            notes.map((note: NoteData) => (
              <NoteCard
                key={note._id}
                title={note.title}
                date={note.createdOn}
                content={note.content}
                tags={note.tags}
                isPinned={note.isPinned}
                onEdit={() => handleEdit(note)}
                onDelete={() => handleDelete(note._id)}
                onPinNote={() => handlePinNote(note._id)}
              />
            ))
          )}
        </div>
      </div>

      <button
        className="btn w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() =>
          setAddEditModal({ isShown: true, type: "add", data: null })
        }
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel="Add or Edit Note"
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 overflow-y-scroll p-5"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data || undefined}
          onClose={closeModal}
          getAllNotes={getAllNotes}
        />
      </Modal>
    </>
  );
};

export default Home;
