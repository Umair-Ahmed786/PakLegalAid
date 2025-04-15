import React, { useContext, useEffect, useRef, useState } from 'react';
import { NoteContext } from '../context/notes/NoteContext';
import NotesItem from './NotesItem';
import { useNavigate } from 'react-router-dom';

const Notes = () => {
  const context = useContext(NoteContext);
  const { notes, getnotes, editnote } = context;

  //Creating Navigation
  const navigate = useNavigate();
  
  //references
  const modalRef = useRef(null);
  const CloseModalRef = useRef(null);
  
  // Creating states for title and description
  const [note, setnote] = useState('');
  const [id, setid] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, settags] = useState('');

  useEffect(() => {
    if(localStorage.getItem('token')){
      getnotes();
    }
    else{
      navigate('/login');
    }
  }, []);

  const OpenUpdateModal = (note) => {
    const modal = new window.bootstrap.Modal(modalRef.current);
    modal.show();

    setnote(note);
    setid(note._id);
    setTitle(note.title);
    setDescription(note.description);
    settags(note.tag);
  };

  //updating note
  const handleupdate = () => {

    editnote(id, title, description, tags);
    CloseModalRef.current.click();
  };

  return (
    <>
      {/* Modal */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={modalRef}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Edit note</h5>
            </div>

            {/* Form started */}
            <div className="modal-body">
              <div className="my-3">
                <form>
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

                </form>
              </div>
            </div>
            {/* Form ended */}

            <div className="modal-footer">
              <button ref={CloseModalRef} type="button" className="btn btn-secondary" onClick={() => {
                const modal = window.bootstrap.Modal.getInstance(modalRef.current);
                modal.hide();
              }}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleupdate}>Update</button>
            </div>
          </div>
        </div>
      </div>

      {/* Notes list */}
      <div className="row my-3">
        {notes.length===0? <><h4>No Notes to display</h4></> :
           notes.map((note) => (
          <NotesItem key={note._id} OpenUpdateModal={OpenUpdateModal} note={note} />
        ))}
      </div>
    </>
  );
};

export default Notes;
