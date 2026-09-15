import Sort1img from '../assets/sort1img.svg';
import Sort2img from '../assets/sort2img.svg';
import Addimg from '../assets/addimg.svg';
import { usePage, router } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Searchuser({ initialSearch = '' }) {
    const [search, setSearch] = useState(initialSearch);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);

        // Sends query to your controller's index method
        router.get(
            window.location.pathname,
            { search: value },
            { 
                preserveState: true, // Prevents page reload
                replace: true        // Avoids polluting browser history on every keystroke
            }
        );
    };

    return (
        <div className='searchuser'>
            <input 
                type="text"
                placeholder="Search..." 
                value={search}
                onChange={handleSearch}
            />
            <button type="button"><img src={Sort1img} alt="sort option 1" /></button>
            <button type="button"><img src={Sort2img} style={{ height: '60%' }} alt="sort option 2" /></button>
        </div>
    );
}