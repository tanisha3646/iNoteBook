import React, { useContext, useState } from 'react'
import noteContext from '../context/notes/noteContext';

const AddNote = (props) => {
    const context = useContext(noteContext);
    const { addNote } = context;

    const [note, setNote] = useState({ title: "", description: "", tag: "" })
    const addButOnClk = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag)
        setNote({ title: "", description: "", tag: "default" })
        props.showAlert("Note added successfully", "success");
    }

    const onchange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }
    return (
        <div>
            <div className="container my-4">
                <h1>Add a note</h1>
                <form className='my-4'>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" name="title" value = {note.title} onChange={onchange} minLength={2} required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" className="form-control" id="description" value = {note.description} name="description" onChange={onchange} minLength={5} required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label">Tag</label>
                        <input type="text" className="form-control" id="tag" value = {note.tag} name="tag" onChange={onchange} />
                    </div>
                    <button disabled={note.title.length <=2 || note.description.length <=5} type="submit" className="btn btn-primary" onClick={addButOnClk}>Add Note</button>
                </form>
            </div>
        </div>
    )
}

export default AddNote
