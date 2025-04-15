import React, {useContext} from 'react'
import { NoteContext } from '../context/notes/NoteContext'

const NotesItem = ({  OpenUpdateModal ,note}) => {

    const context = useContext(NoteContext);
    const {deletenote} = context;

    return (
        <div className='col-md-3'>
            <div className="card my-3">

                <div className="card-body">

                    <div className="d-flex align-items-center">

                        <h5 className="card-title">{note.title}</h5>
                        <i className="fa-sharp fa-solid fa-trash mx-3" onClick={()=>{deletenote(note._id)}}></i>
                        <i className="fa-solid fa-pen-to-square mx-3" onClick={()=>OpenUpdateModal(note)}></i>

                    </div>
                    <p className="card-text">{note.description}</p>
                    <p className="card-text">{note.tag}</p>
                    {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
                </div>
            </div>
        </div>
    )
}

export default NotesItem
