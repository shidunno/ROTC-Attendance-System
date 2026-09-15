import Sort1img from '../assets/sort1img.svg';
import Sort2img from '../assets/sort2img.svg';
import Addimg from '../assets/addimg.svg';
import { router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

export default function Searchuser({ initialSearch = '' }) {
    const [search, setSearch] = useState(initialSearch);

    // Keep local state in sync if props change from backend
    useEffect(() => {
        setSearch(initialSearch);
    }, [initialSearch]);

    useEffect(() => {
        if (search === initialSearch) return;

        const timer = setTimeout(() => {
            // Strip any trailing slash to prevent Laravel redirecting and killing AJAX
            const cleanPath = window.location.pathname.replace(/\/+$/, '');

            router.get(
                cleanPath || '/', 
                { search: search },
                { 
                    preserveState: true,
                    preserveScroll: true,
                    replace: true 
                }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [search, initialSearch]);

    return (
        <div className='searchuser'>
            <input 
                type="text"
                placeholder="Search..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button type="button"><img src={Sort1img} alt="sort option 1" /></button>
            <button type="button"><img src={Sort2img} style={{ height: '60%' }} alt="sort option 2" /></button>
        </div>
    );
}