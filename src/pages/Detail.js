import { Link, useParams } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import Header from "../Header";
import Loader from "../components/Loader";
import pencil from "../images/icons8-pencil-30.png";
import trash from "../images/icons8-trash-26.png";

const Detail = ({
  note,
  user,
  logout,
  currentUserFromDb,
  notesDataFromDb,
  handleDelete,
  editorVal,
  showEditpopup,
  handleEditPopup,
  handleUpdateNoteChange,
  waitForUserFromDb,
  handleEdit,
}) => {
  const { id } = useParams();
  const eachNote = note.filter((item) => item.id === Number(id))[0];
  const eachUserNote = notesDataFromDb.filter((item) => item.id === id)[0];

  // //to handle edit popup show and hide
  // const [showDeletePrompt, ssetSowDeletePrompt] = useState(false);
  // function handleDeletePrompt() {
  //   ssetSowDeletePrompt((prev) => !prev);
  // }

  return (
    <>
      <Header
        user={user}
        logout={logout}
        currentUserFromDb={currentUserFromDb}
      />
      <div className="py-[100px] px-3 sm:px-[100px]">
        {!waitForUserFromDb && !user && <Loader />}
        {waitForUserFromDb && user && <Loader />}
        {/* edit note popup */}
        {showEditpopup && (
          <div className="w-full h-screen bg-[#252525] p-5 sm:p-8 fixed top-16 left-0 z-20 overflow-y-auto no-scrollbar">
            {/* {showDeletePrompt && (
              <div className="w-1/2 p= bg-red-400">
                <p>Are you sure?</p>
                <div className="w-full flex">
                  <button className="bg-rose-500/80 font-bold text-[0.90rem] mb-4 px-5 py-1 rounded-md hover:bg-rose-400 hover:translate-y-[6px] transition-all duration-300">
                    Delete
                  </button>
                  <button className="bg-rose-500/80 font-bold text-[0.90rem] mb-4 px-5 py-1 rounded-md hover:bg-rose-400 hover:translate-y-[6px] transition-all duration-300">
                    Cancel
                  </button>
                </div>
              </div>
            )} */}
            <button
              onClick={() =>
                handleEditPopup(
                  currentUserFromDb.displayName,
                  id,
                  eachUserNote?.title
                )
              }
              className="bg-rose-500/80 font-bold text-[0.90rem] mb-4 px-5 py-1 rounded-md hover:bg-rose-400 hover:translate-y-[6px] transition-all duration-300"
            >
              Cancel edit
            </button>
            <div className="w-full h-[fit-content] sm:w-2/3 p-4 sm:p-6 border-2 border-rose-500 rounded-lg relative">
              <div className="w-full h-full bg-rose-500/70 absolute top-0 left-0 sm:py-2 py-1 sm:px-6 px-4">
                <p className="text-[0.85rem]">Titles are not editable</p>
              </div>
              <div>
                {!user && (
                  <h1 className="text-[1.5rem] sm:text-[2rem] font-bold text-white">
                    {eachNote?.title}
                  </h1>
                )}
                {user && (
                  <h1 className="text-[1.5rem] sm:text-[2rem] font-bold text-white">
                    {eachUserNote?.title}
                  </h1>
                )}
              </div>
              <div>
                {!user && (
                  <h2 className="text-[1rem] mt-5 text-[#ffab91]">
                    <span className="text-[#ffab91]">Created :</span>{" "}
                    {eachNote?.date}
                  </h2>
                )}
                {user && (
                  <h2 className="text-[1rem] mt-5 text-[#ffab91]">
                    <span className="text-[#ffab91]">Created :</span>{" "}
                    {eachUserNote?.createdAt}
                  </h2>
                )}
              </div>
            </div>

            <form>
              <div className="w-full p-5 sm:p-8 mt-6 sm:mt-16 border-2 border-[#ffab91] rounded-lg">
                <p className="text-[1.25rem]">Body here</p>
                <textarea
                  type="text"
                  id="body"
                  onChange={handleUpdateNoteChange}
                  value={editorVal.body}
                  className="w-full h-[180px] bg-[#ffab91]/20 text-[1rem] sm:text-[1.5rem] my-4 p-3 outline-none rounded-lg"
                  required
                />
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleEdit(
                    currentUserFromDb.displayName,
                    id,
                    eachUserNote?.title,
                    editorVal.body
                  );
                  // window.location.reload();
                }}
                className="w-full sm:w-2/3 bg-rose-500 my-8 sm:my-16 p-5 outline-none rounded-lg"
              >
                Edit note
              </button>
            </form>
          </div>
        )}
        <div className="w-full flex justify-between items-start">
          <Link to="/notes">
            <button className="bg-rose-500/80 font-bold text-[0.90rem] mb-8 px-5 py-1 rounded-md hover:bg-rose-400 hover:translate-y-[6px] transition-all duration-300">
              Back
            </button>
          </Link>
          <div className="flex gap-4 justify-between items-center">
            <button
              onClick={() => handleEditPopup(id)}
              className="bg-inherit font-bold text-[0.90rem] mb-8 p-4 sm:p-5 rounded-full border-2 border-[#ffab91] hover:bg-[#ffab91]/50 hover:translate-y-[6px] transition-all duration-300"
            >
              <img alt="edit" src={pencil} className="w-6 sm:w-8 h-6 sm:h-8" />
            </button>
            <button
              onClick={() => {
                handleDelete(
                  currentUserFromDb.displayName,
                  id,
                  eachUserNote?.title
                );
              }}
              className="bg-inherit font-bold text-[0.90rem] mb-8 p-4 sm:p-5 rounded-full border-2 border-rose-400 hover:bg-rose-400/50 hover:translate-y-[6px] transition-all duration-300"
            >
              <img alt="edit" src={trash} className="w-6 sm:w-8 h-6 sm:h-8" />
            </button>
          </div>
        </div>
        <div className="w-full sm:w-[fit-content] p-5 sm:p-8 border-2 border-rose-500 rounded-lg">
          <div>
            {!user && (
              <h1 className="text-[1.5rem] sm:text-[2rem] font-bold text-white">
                {eachNote?.title}
              </h1>
            )}
            {user && (
              <h1 className="text-[1.5rem] sm:text-[2rem] font-bold text-white">
                {eachUserNote?.title}
              </h1>
            )}
          </div>
          <div>
            {!user && (
              <h2 className="text-[1rem] mt-5 text-[#ffab91]">
                <span className="text-[#ffab91]">Created :</span>{" "}
                {eachNote?.date}
              </h2>
            )}
            {user && (
              <h2 className="text-[1rem] mt-5 text-[#ffab91]">
                <span className="text-[#ffab91]">Created :</span>{" "}
                {eachUserNote?.createdAt}
              </h2>
            )}
          </div>
        </div>
        <div className="w-full min-h-[200px] p-5 sm:p-8 mt-16 border-2 border-[#ffab91] rounded-lg">
          {!user && <p className="text-[1.25rem]">{eachNote?.body}</p>}
          {user && <p className="text-[1.25rem]">{eachUserNote?.body}</p>}
        </div>
      </div>
      <ScrollToTop />
    </>
  );
};

export default Detail;
