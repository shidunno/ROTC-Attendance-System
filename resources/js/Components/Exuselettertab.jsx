import Pdfimg from '../assets/pdfimg.svg'
import { Link, usePage } from '@inertiajs/react';

export default function Excuselettertab() {

    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <>
            <div style = {{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div id = 'excuselettercontainer'>
                    <div id = 'excuseletterinnercontainer'>
                        <div id = 'excuseletterinnercontainer1'>
                            <img src = {Pdfimg}></img>
                            <div className='excuseletterinnercontainer3'>
                                <Link style = {{textDecoration: 'none', color: '#467646'}}>Name</Link>
                                <p>Date</p>
                            </div>
                        </div>
                        {user?.role === 'admin' && (
                        <div id = 'excuseletterinnercontainer2'>
                            <button className='excuseletterbutton' style={{backgroundColor: '#69B163'}}>Accept</button>
                            <button className='excuseletterbutton' style = {{backgroundColor: '#C94C4C'}}>Reject</button>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );

}