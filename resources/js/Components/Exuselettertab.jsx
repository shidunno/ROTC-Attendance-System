import Pdfimg from '../assets/pdfimg.svg';
import { Link, usePage, router } from '@inertiajs/react';

export default function Excuselettertab({ letter }) {
    const { auth } = usePage().props;
    const user = auth.user;

    // Handlers for Accept and Reject actions (No Ziggy needed)
    const handleAction = (status) => {
        router.post(`/excuse-letters/${letter.id}`, {
            status: status, // 'accepted' or 'rejected'
        }, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div id='excuselettercontainer' style={{marginBottom: 0}}>
                    <div id='excuseletterinnercontainer' style={{marginBottom: 0, marginTop: 0}}>
                        <div id='excuseletterinnercontainer1'>
                            {/* Clickable PDF preview / download link */}
                            <a href={letter?.file_url} target="_blank" rel="noopener noreferrer">
                                <img src={Pdfimg} alt="PDF Icon" />
                            </a>
                            <div className='excuseletterinnercontainer3'>
                                <Link 
                                    href={`/cadets/${letter?.user_id}`} 
                                    style={{ textDecoration: 'none', color: '#467646' }}
                                >
                                    {letter?.user?.name || 'Cadet Name'}
                                </Link>
                                <p>{letter?.date || 'Date Submitted'}</p>
                            </div>
                        </div>

                        {/* Admin Action Buttons */}
                        {user?.role === 'admin' && (
                            <div id='excuseletterinnercontainer2'>
                                <button 
                                    type="button"
                                    className='excuseletterbutton' 
                                    style={{ backgroundColor: '#69B163' }}
                                    onClick={() => handleAction('accepted')}
                                >
                                    Accept
                                </button>
                                <button 
                                    type="button"
                                    className='excuseletterbutton' 
                                    style={{ backgroundColor: '#C94C4C' }}
                                    onClick={() => handleAction('rejected')}
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}