import Addimg from '../assets/addimg.svg'
import { useRef, useState } from 'react'
import { router, usePage } from '@inertiajs/react'

export default function Usermanagementheader({ 
    search = '', 
    role = '', 
    status = '', 
    onSearchChange, 
    onRoleChange, 
    onStatusChange 
}) {
    const fileInputRef = useRef(null)
    const [isOpen, setIsOpen] = useState(false)
    const [roleOpen, setRoleOpen] = useState(false)
    const [statusOpen, setStatusOpen] = useState(false)
    const { auth, flash, errors } = usePage().props

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        router.post('/import-cadets', { file }, {
            onFinish: () => setIsOpen(true)
        })
        e.target.value = ''
    }

    const selectRole = (e, value) => {
        e.stopPropagation(); // Prevents parent onClick from triggering
        onRoleChange(value);
        setRoleOpen(false);  // Closes the dropdown
    }

    const selectStatus = (e, value) => {
        e.stopPropagation(); // Prevents parent onClick from triggering
        onStatusChange(value);
        setStatusOpen(false); // Closes the dropdown
    }

    const hasErrors = errors?.import && errors.import.length > 0
    const isAdmin = auth?.user?.role === 'admin'

    return (
      <>
        <div className="usermanagementheader">
            <input 
                type="text" 
                placeholder="Search by ID or Name" 
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
            />

            {/* Custom Role Dropdown */}
            <div 
                className="custom-dropdown" 
                onClick={() => { setRoleOpen(!roleOpen); setStatusOpen(false); }}
            >
                <div className="dropdown-selected">
                    <span>{role ? (role === 'cadet' ? 'Cadet' : 'Leader') : 'Role'}</span>
                    <svg className={`arrow-icon ${roleOpen ? 'rotate' : ''}`} width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                {roleOpen && (
                    <div className="dropdown-menu">
                        <div className="dropdown-item" onClick={(e) => selectRole(e, '')}>All Roles</div>
                        <div className="dropdown-item" onClick={(e) => selectRole(e, 'cadet')}>Cadet</div>
                        <div className="dropdown-item" onClick={(e) => selectRole(e, 'leader')}>Leader</div>
                    </div>
                )}
            </div>

            {/* Custom Status Dropdown */}
            <div 
                className="custom-dropdown" 
                onClick={() => { setStatusOpen(!statusOpen); setRoleOpen(false); }}
            >
                <div className="dropdown-selected">
                    <span>{status || 'Status'}</span>
                    <svg className={`arrow-icon ${statusOpen ? 'rotate' : ''}`} width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                {statusOpen && (
                    <div className="dropdown-menu">
                        <div className="dropdown-item" onClick={(e) => selectStatus(e, '')}>All Statuses</div>
                        <div className="dropdown-item" onClick={(e) => selectStatus(e, 'Active')}>Active</div>
                        <div className="dropdown-item" onClick={(e) => selectStatus(e, 'Archive')}>Archive</div>
                    </div>
                )}
            </div>

            {isAdmin && (
                <div className="addfile" onClick={() => fileInputRef.current.click()}>
                    <input 
                        type="file"
                        accept=".xlsx, .xls, .csv" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        onChange={handleFileChange} 
                    />
                    <p>Add user</p>
                    <img src={Addimg} alt="" />
                </div>
            )}
        </div>

        {isOpen && (
            <div className="modal-overlay">
                <div className="modal-card">
                    <h3 className={hasErrors ? 'modal-title-error' : 'modal-title-success'}>
                        {hasErrors ? 'Import Failed' : 'Success'}
                    </h3>
                    <div className="modal-body">
                        {hasErrors ? (
                            Array.isArray(errors.import) 
                                ? errors.import.map((err, i) => <p key={i}>{err}</p>)
                                : <p>{errors.import}</p>
                        ) : (
                            <p>{flash?.success || 'Cadets imported successfully!'}</p>
                        )}
                    </div>
                    <button onClick={() => setIsOpen(false)} className="modal-close-btn">
                        Close
                    </button>
                </div>
            </div>
        )}
      </>  
    )
}