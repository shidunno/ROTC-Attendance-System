import Modal from 'react-modal'
import Announcementprofileimg from '../assets/announcementprofileimg.svg'

Modal.setAppElement('#app');

export default function Usermodal({isOpen, onClose}) {

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className = 'usermodal' overlayClassName='usermodaloverlay'>
        <span onClick={onClose}>x</span>
        <img src = {Announcementprofileimg}></img>
        <h1>Name</h1>
        <p>Position</p>
        <input type = 'text' placeholder='Student ID'></input>
        <input type = 'text' placeholder='Course'></input>
        <input type = 'text' placeholder='Contact #'></input>
        <input type = 'text' placeholder='Address'></input>
        </Modal>
    );


}