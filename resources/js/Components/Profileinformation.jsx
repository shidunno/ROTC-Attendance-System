import React, { useState } from 'react';
import { usePage, useForm } from '@inertiajs/react';

export default function ProfileInformation({ onBack }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const isAdmin = user?.role === 'admin';

    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        avatar: null,
    });

    const [photoPreview, setPhotoPreview] = useState(
        user?.profile_photo_path
            ? `/profile/photo/${user.id}?v=${Date.now()}`
            : null
    );

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (
            (name === 'name' || name === 'email') &&
            !isAdmin
        ) {
            return;
        }

        setData(name, value);
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setData('avatar', file);

        const previewUrl = URL.createObjectURL(file);
        setPhotoPreview(previewUrl);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post('/profile/update', {
            preserveScroll: true,
            forceFormData: true,

            onSuccess: () => {
                window.location.reload();
            },
        });
    };

    return (
        <div className="profile-info-container">

            <div className="profile-info-header">
                <button
                    type="button"
                    onClick={onBack}
                >
                    Back
                </button>

                <h1>Profile Information</h1>
            </div>

            <form onSubmit={handleSubmit}>

                <div className="profile-photo-section">

                    <div className="profile-photo-wrapper">
                        {photoPreview ? (
                            <img
                                src={photoPreview}
                                alt="Profile"
                            />
                        ) : (
                            <div className="profile-photo-placeholder">
                                No Photo
                            </div>
                        )}
                    </div>

                    <input
                        type="file"
                        id="photo-upload"
                        name="avatar"
                        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                        onChange={handlePhotoChange}
                        style={{ display: 'none' }}
                    />

                    <label
                        htmlFor="photo-upload"
                        style={{ cursor: 'pointer' }}
                    >
                        Change Photo
                    </label>

                    {errors.avatar && (
                        <p className="error">
                            {errors.avatar}
                        </p>
                    )}

                </div>

                <div className="profile-field">

                    <label htmlFor="name">
                        Name
                    </label>

                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        disabled={!isAdmin}
                    />

                    {errors.name && (
                        <p className="error">
                            {errors.name}
                        </p>
                    )}

                </div>

                <div className="profile-field">

                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        disabled={!isAdmin}
                    />

                    {errors.email && (
                        <p className="error">
                            {errors.email}
                        </p>
                    )}

                </div>

                <div className="profile-field">

                    <label htmlFor="role">
                        Role
                    </label>

                    <input
                        id="role"
                        type="text"
                        value={
                            user?.role
                                ? user.role.toUpperCase()
                                : ''
                        }
                        disabled
                    />

                </div>

                <div className="profile-actions">

                    <button
                        type="button"
                        onClick={onBack}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={processing}
                    >
                        {processing
                            ? 'Saving...'
                            : 'Save Changes'}
                    </button>

                </div>

            </form>
        </div>
    );
}