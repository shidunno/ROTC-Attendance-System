import Excelimg from '../assets/excelimg.svg'
import Downloadimg from '../assets/downloadimg.svg'
import { Link } from '@inertiajs/react';


export default function Reportstab() {

    return (
        <>
            <div style = {{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div id = 'excuselettercontainer'>
                    <div id = 'excuseletterinnercontainer'>
                        <div id = 'excuseletterinnercontainer1'>
                            <img src = {Excelimg}></img>
                            <div className='excuseletterinnercontainer3'> 
                                <Link style = {{textDecoration: 'none', color: '#467646'}}>Name</Link>
                                <p>Date</p>
                            </div>
                        </div>
                        <div id = 'excuseletterinnercontainer2'>
                            <img src = {Downloadimg}></img>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}