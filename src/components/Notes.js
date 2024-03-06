import React, { useContext, useEffect, useRef, useState } from 'react';
import noteContext from '../context/notes/noteContext';
import NoteItem from './NoteItem';
import AddNote from './AddNote';
import { useNavigate } from "react-router-dom";

const Notes = (props) => {
  const context = useContext(noteContext);
  const { notes, getNotes, updNote } = context;
  const [note, setNote] = useState({ id : "", edtTitle: "", edtDescription: "", edtTag: "default" })
  let navigate = useNavigate();
  useEffect(() => {
        // eslint-disable-next-line
    return () => {
      if(localStorage.getItem('token')){
        getNotes();
      }
      else
        navigate('/login');
    }
  }, [])

  const updateNote = (currentnote) => {
    ref.current.click();
    setNote({id : currentnote._id, edtTitle: currentnote.title, edtDescription : currentnote.description, edtTag : currentnote.tag})
  }
  
  const onchange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value })
}
  const handleClk = ()=>{
    updNote(note.id, note.edtTitle, note.edtDescription, note.edtTag);
    refClose.current.click();
    props.showAlert("Updated successfully", "success");
  }
  const ref = useRef(null);
  const refClose = useRef(null);
  return (
    <>
      <AddNote showAlert = {props.showAlert}/>
      <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal"></button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className='my-4'>
                <div className="mb-3">
                  <label htmlFor="edtTitle" className="form-label">Title</label>
                  <input type="text" className="form-control" id="edtTitle" name="edtTitle" value = {note.edtTitle} aria-describedby="emailHelp" onChange={onchange} minLength={2} required/>
                </div>
                <div className="mb-3">
                  <label htmlFor="edtDescription" className="form-label">Description</label>
                  <input type="text" className="form-control" id="edtDescription" name="edtDescription" value = {note.edtDescription}  onChange={onchange} minLength={5} required/>
                </div>
                <div className="mb-3">
                  <label htmlFor="edtTag" className="form-label">Tag</label>
                  <input type="text" className="form-control" id="edtTag" name="edtTag" value = {note.edtTag} onChange={onchange} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" disabled={note.edtTitle.length <=2 || note.edtDescription.length <=5} onClick = {handleClk} className="btn btn-primary">Update Note</button>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-4">
        <h1 className="my-4">Your Notes</h1>
        <div className="container mx-2">
          {notes.length ===0 && "No notes to display"}
        </div>
        {notes.map((note) => {
          return <NoteItem key={note._id} updateNote={updateNote} note={note} showAlert = {props.showAlert}/>
        })}
      </div>
    </>

  )
}

export default Notes
