import { useState } from "react";
import NoteContext from "./noteContext";
const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInital = [];

  const [notes, setNotes] = useState(notesInital)

  // ADD a note
  const addNote = async (title, description, tag) => {
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });
    response.json().then(response => {
      setNotes(notes.concat(response))
      }
    );
  }

  // Delete a note
  const deleteNote = async(id) => {
    await fetch(`${host}/api/notes/deleteNote/${id}`, {
      method: "DELETE",
      headers: {
        "auth-token": localStorage.getItem('token')
      }
    });
    // const json = await response.json();
    const newNotes = notes.filter((note) => { return note._id !== id });
    setNotes(newNotes);
  }

  // Edit a note
  const updNote = async (id, title, description, tag) => {
    await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });
    // const json = await response.json();
    let newNotes = JSON.parse(JSON.stringify(notes));
    for (let index = 0; index < newNotes.length; index++) {
      if (newNotes[index]._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
      setNotes(newNotes);

    }
  }

  // Get all notes
  const getNotes = async () => {
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      }
    });
    const json = await response.json()
    setNotes(json)
  }
  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, updNote, getNotes}}>
      {props.children}
    </NoteContext.Provider>
  )
}
export default NoteState;