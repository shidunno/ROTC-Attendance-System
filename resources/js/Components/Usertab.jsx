import React from 'react';
import Searchuser from "./Searchuser";
import Userlist from "../Components/Userlist";

export default function Usertab({ page, users = [], filters = {} }) {
    return (
        <div className="usertab">
            <Searchuser initialSearch={filters.search || ''} />
            <Userlist page={page} users={users} />
        </div>
    );
}