import Main from "./Main";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Notes from "./pages/Notes";
import { useState, useEffect } from "react";
import Detail from "./pages/Detail";
import "./output.css";
import notedata from "./data/notedatamock.json";
// import userNoteData from "./data/userNoteData.json";
import Create from "./pages/Create";
import Register from "./pages/Register";
import Login from "./pages/Login";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "./firebase/firebase-config";
import {
  getDocs,
  addDoc,
  collection,
  query,
  where,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

function App() {
  const location = useLocation();
  let currentPage = location.pathname;

  //to track cursour movement
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    setCoords({
      x: event.clientX - event.target.offsetLeft,
      y: event.clientY - event.target.offsetTop,
    });
  };

  const [globalCoords, setGlobalCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // 👇️ get global mouse coordinates
    const handleWindowMouseMove = (event) => {
      setGlobalCoords({
        x: event.screenX,
        y: event.screenY,
      });
    };
    window.addEventListener("mousemove", handleWindowMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
    };
  }, []);

  //to save reg form input
  const [regForm, setRegForm] = useState({
    displayName: "",
    email: "",
    password: "",
  });

  // console.log(regForm);

  //to handle form input change chnage
  function handleRegChange(event) {
    const { id, value } = event.target;
    setRegForm((prevState) => {
      return {
        ...prevState,
        [id]: value,
      };
    });
  }

  //to save login form input
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  //to handle form input change chnage
  function handleLoginChange(event) {
    const { id, value } = event.target;
    setLoginForm((prevState) => {
      return {
        ...prevState,
        [id]: value,
      };
    });
  }

  //to save current user from auth in state
  const [user, setUser] = useState({});
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  //to save current user from db
  const [currentUserFromDb, setCurrentUserFromDb] = useState({});
  const [waitForUserFromDb, setWaitForUserFromDb] = useState(false);

  //to get users saved in db
  useEffect(() => {
    const getUserDetails = async () => {
      setWaitForUserFromDb(true);
      const userQuery = query(
        collection(db, "users"),
        where("email", "==", user?.email)
      );
      try {
        const querySnapshot = await getDocs(userQuery);
        querySnapshot.forEach((doc) => {
          setCurrentUserFromDb(doc.data());
        });
        setWaitForUserFromDb(false);
      } catch (err) {
        console.log(err.message);
        setWaitForUserFromDb(false);
      }
    };
    getUserDetails();
  }, [user]);

  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();

  //function to create user doc on sign up
  const createUserDocument = async (email, name) => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        email: email,
        displayName: name,
        createdAt: new Date(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (err) {
      console.error("Error adding document: ", err);
    }
  };

  //to handle reg form data submit to firebase
  const register = async (e) => {
    e.preventDefault();
    setShowLoader(true);

    try {
      await createUserWithEmailAndPassword(
        auth,
        regForm.email,
        regForm.password
      );
      setShowLoader(false);
      navigate("/notes");
      await createUserDocument(regForm.email, regForm.displayName);
    } catch (error) {
      setShowLoader(false);
      console.log(error.message);
      alert("Oh good lord! USER ALREADY EXISTS!!");
    }
  };

  //to log in users
  const login = async (e) => {
    e.preventDefault();
    setShowLoader(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        loginForm.email,
        loginForm.password
      );
      setShowLoader(false);
      navigate("/notes");
    } catch (error) {
      setShowLoader(false);
      console.log(error.message);
      alert("Oh commoooon! INVALID USER CREDENTIALS!!");
    }
  };

  //to log out users
  const logout = async () => {
    signOut(auth).then(() => {
      navigate("/");
    });
  };

  //to set the default notes in state
  const [note, setNote] = useState(notedata);
  // const [userNote, setUserNote] = useState(
  //   JSON.parse(localStorage.getItem("stickyNotes")) || userNoteData
  // );

  //to set hover state of each sticky note
  function handleNoteHover(index) {
    const newNote = [...note];
    newNote[index].hover = true;
    setNote(newNote);
    const newUserNote = [...notesDataFromDb];
    newUserNote[index].hover = true;
    setNotesDataFromDb(newUserNote);
  }

  //to set hover out state of each sticky note
  function handleNoteOut(index) {
    const newNote = [...note];
    newNote[index].hover = false;
    setNote(newNote);
    const newUserNote = [...notesDataFromDb];
    if (newUserNote) newUserNote[index].hover = false;
    setNotesDataFromDb(newUserNote);
  }

  //to handle the click state of each sticky note
  function handleClick(index) {
    const newNote = [...note];
    newNote[index].hover = false;
    setNote(newNote);
    const newUserNote = [...notesDataFromDb];
    if (newUserNote) newUserNote[index].hover = false;
    setNotesDataFromDb(newUserNote);
  }

  //to show and hide password
  const [showPassword, setShowPassword] = useState(false);
  function togglePassword() {
    setShowPassword((prev) => !prev);
  }

  //to show and hide welcome message
  const [welcomeMessage, setWelcomeMessage] = useState(true);
  function handleHideWelcome() {
    setWelcomeMessage((prev) => !prev);
  }

  //to control create note input
  const [newNote, setNewNote] = useState({
    title: "",
    body: "",
  });

  //to handle form input change chnage
  function handleNewNoteChange(event) {
    const { id, value } = event.target;
    setNewNote((prevState) => {
      return {
        ...prevState,
        [id]: value,
      };
    });
  }

  //to formate date
  const date = new Date();
  const formattedDate = date
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, "-");

  const [notesDataFromDb, setNotesDataFromDb] = useState(
    JSON.parse(localStorage.getItem("notesDataFromDb")) || []
  );
  const [allNotesFromDb, setAllNotesFromDb] = useState(
    JSON.parse(localStorage.getItem("allNotesDataFromDb")) || []
  );
  // console.log(notesDataFromDb);
  const [updateNotes, setUpdateNotes] = useState(false);
  // let notesFromDbSavedInLocalStorage = JSON.parse(
  //   localStorage.getItem("allNotesDataFromDb")
  // );

  //to send created notes to db
  const createNoteDocument = async (title, body) => {
    try {
      const querySnapshot = await getDocs(collection(db, "notes"));
      let notes = [];
      querySnapshot.forEach((doc) => {
        notes.push(doc.data());
      });
      setAllNotesFromDb(notes);

      await setDoc(
        doc(
          db,
          "notes",
          `${currentUserFromDb?.displayName}_${title.replace(/ /g, "_")}0${
            notesDataFromDb.length + 1
          }_${title.replace(/ /g, "_")}`
        ),
        {
          id: `${title.replace(/ /g, "_")}0${notesDataFromDb.length + 1}`,
          owner: currentUserFromDb?.email,
          title: title,
          body: body,
          createdAt: formattedDate,
          hover: false,
        }
      );
      console.log("Note created");
      setUpdateNotes((prev) => !prev);
      window.location.reload();
    } catch (err) {
      console.error("Error creating note: ", err);
    }
  };

  useEffect(() => {
    localStorage.setItem("allNotesDataFromDb", JSON.stringify(allNotesFromDb));
  }, [allNotesFromDb]);

  useEffect(() => {
    localStorage.setItem("notesDataFromDb", JSON.stringify(notesDataFromDb));
  }, [notesDataFromDb]);

  //to delete note from db
  const deleteDocument = async (userName, id, title) => {
    await deleteDoc(
      doc(db, "notes", `${userName}_${id}_${title.replace(/ /g, "_")}`)
    );
    console.log("note deleted");
  };

  //to handle edit popup show and hide
  const [showEditpopup, setShowEditpopup] = useState(false);
  function handleEditPopup(userName, id, title) {
    setShowEditpopup((prev) => !prev);
    getDocRef(userName, id, title);
  }
  let docRefEdit = [];
  let docNested;

  //to get note to edit from db
  const getDocRef = (id) => {
    docRefEdit.push(
      notesDataFromDb.filter((item) => {
        return item.id === id;
      })
    );
    docNested = docRefEdit[0][0];
    setEditorVal({
      body: docNested?.body,
    });
  };

  //to update doc

  const editDocument = async (userName, id, title, body) => {
    const docRef = doc(
      db,
      "notes",
      `${userName}_${id}_${title.replace(/ /g, "_")}`
    );
    await updateDoc(docRef, {
      body: body,
    });
    console.log("note updated!");
    window.location.reload();
  };

  //to control update note input
  const [editorVal, setEditorVal] = useState({
    body: "test",
  });

  //to handle form input change chnage
  function handleUpdateNoteChange(event) {
    const { id, value } = event.target;
    setEditorVal((prevState) => {
      return {
        ...prevState,
        [id]: value,
      };
    });
  }

  //to delete sticky note
  function handleDelete(user, id, title) {
    deleteDocument(user, id, title);
    navigate("/notes");
    setUpdateNotes((prev) => !prev);
  }

  //to create new sticky note
  function handleCreate(event) {
    event.preventDefault();
    if (!newNote) {
      return;
    }

    createNoteDocument(newNote.title, newNote.body);
    navigate("/notes");
  }

  //to edit sticky note
  function handleEdit(userName, id, title, body) {
    editDocument(userName, id, title, body);
    setShowEditpopup((prev) => !prev);
  }

  //to get notes data from db
  useEffect(() => {
    const getNotes = async () => {
      const userQuery = query(
        collection(db, "notes"),
        where("owner", "==", user?.email)
      );
      try {
        const querySnapshot = await getDocs(userQuery);
        let notes = [];
        querySnapshot.forEach((doc) => {
          notes.push(doc.data());
        });

        let arranged = notes.sort(function (a, b) {
          return b.id.slice(-2) - a.id.slice(-2);
        });
        setNotesDataFromDb(arranged);
      } catch (err) {
        console.log(err.message);
      }
    };
    getNotes();
  }, [user, updateNotes]);

  //to show modal in 3 seconds
  const [showModal, setShowModal] = useState(false);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Main
            user={user}
            logout={logout}
            currentUserFromDb={currentUserFromDb}
            waitForUserFromDb={waitForUserFromDb}
            currentPage={currentPage}
            globalCoords={globalCoords}
            handleMouseMove={handleMouseMove}
            coords={coords}
          />
        }
      />
      <Route
        path="/notes"
        element={
          <Notes
            user={user}
            note={note}
            handleNoteHover={handleNoteHover}
            handleNoteOut={handleNoteOut}
            handleClick={handleClick}
            logout={logout}
            currentUserFromDb={currentUserFromDb}
            welcomeMessage={welcomeMessage}
            handleHideWelcome={handleHideWelcome}
            waitForUserFromDb={waitForUserFromDb}
            notesDataFromDb={notesDataFromDb}
            currentPage={currentPage}
            globalCoords={globalCoords}
            handleMouseMove={handleMouseMove}
            coords={coords}
          />
        }
      />
      <Route
        path="/note/:id"
        element={
          <Detail
            note={note}
            user={user}
            currentUserFromDb={currentUserFromDb}
            logout={logout}
            notesDataFromDb={notesDataFromDb}
            handleDelete={handleDelete}
            editorVal={editorVal}
            showEditpopup={showEditpopup}
            handleEditPopup={handleEditPopup}
            handleUpdateNoteChange={handleUpdateNoteChange}
            waitForUserFromDb={waitForUserFromDb}
            handleEdit={handleEdit}
          />
        }
      />
      <Route
        path="/create"
        element={
          <Create
            user={user}
            currentUserFromDb={currentUserFromDb}
            logout={logout}
            handleNewNoteChange={handleNewNoteChange}
            handleCreate={handleCreate}
            newNote={newNote}
            showModal={showModal}
            setShowModal={setShowModal}
            currentPage={currentPage}
          />
        }
      />
      <Route
        path="/register"
        element={
          <Register
            showPassword={showPassword}
            togglePassword={togglePassword}
            handleRegChange={handleRegChange}
            regForm={regForm}
            showLoader={showLoader}
            register={register}
            user={user}
          />
        }
      />
      <Route
        path="/login"
        element={
          <Login
            showPassword={showPassword}
            togglePassword={togglePassword}
            handleLoginChange={handleLoginChange}
            showLoader={showLoader}
            login={login}
            user={user}
          />
        }
      />
    </Routes>
  );
}

export default App;
