import React, { useContext, useState } from "react";
import { NoteContext } from '../context/notes/NoteContext';
import Notes from './Notes'

function Home() {

  // Creating states for title and description
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, settags] = useState('');

  // Importing context
  const context = useContext(NoteContext);
  const { notes, addnote } = context;

  const handleClick = (e) => {
    e.preventDefault();  // Prevents the page from refreshing
    addnote(title, description, tags);
    setTitle('');        // Clear the input fields after submitting
    setDescription('');
    settags('');
  };

  return (
    <>
      <div className="container my-3">
        <h1>Add a Note</h1>

        {/* Form started */}
        <div className="my-3">
          <form onSubmit={(e)=>{handleClick(e)}}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}  // Corrected to onChange
                minLength={5} required
              />
            </div>

            {/* Decscription */}
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}  // Corrected to onChange
                minLength={5} required
              />
            </div>

            {/* Tags */}
            <div className="mb-3">
              <label htmlFor="Tags" className="form-label">Tags</label>
              <input
                type="text"
                className="form-control"
                id="Tags"
                value={tags}
                onChange={(e) => settags(e.target.value)}  // Corrected to onChange
                minLength={5} required
              />
            </div>

            <button type="submit" className="btn btn-primary" >Add Note</button>  {/* Corrected to onClick */}
          </form>
        </div>

        <h1>Your Notes</h1>
        <Notes />
      </div>
    </>
  );
}

export default Home;
