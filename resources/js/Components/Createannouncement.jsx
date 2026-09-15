import Announcementprofileimg from '../assets/announcementprofileimg.svg'
import Attachmentimg from '../assets/attachmentimg.svg'
import Imageimg from '../assets/imageimg.svg'
import Padimg from '../assets/padimg.svg'

import { useRef } from 'react'
import { useForm } from '@inertiajs/react'

export default function Createannouncement() {
    const fileInputRef = useRef(null)
    const imageInputRef = useRef(null)
    const scheduleInputRef = useRef(null)

    const { data, setData, post, processing, errors, reset } = useForm({
        content: '',
        attachment: null,
        image: null,
        scheduled_at: '',
    })

    const handleInput = (e) => {
        e.target.style.height = 'auto'
        e.target.style.height = `${e.target.scrollHeight}px`
        setData('content', e.target.value)
    }

    const handleImageChange = (e) => {
        const file = e.target.files?.[0] || null
        setData('image', file)
    }

    const handleAttachmentChange = (e) => {
        const file = e.target.files?.[0] || null
        setData('attachment', file)
    }

    const handleSchedule = () => {
        if (scheduleInputRef.current) {
            scheduleInputRef.current.showPicker()
        }
    }

    const removeFile = (type) => {
        if (type === 'image') {
            setData('image', null)
            if (imageInputRef.current) imageInputRef.current.value = ''
        } else if (type === 'attachment') {
            setData('attachment', null)
            if (fileInputRef.current) fileInputRef.current.value = ''
        } else if (type === 'schedule') {
            setData('scheduled_at', '')
            if (scheduleInputRef.current) scheduleInputRef.current.value = ''
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        post('/Announcement', {
            forceFormData: true,
            onSuccess: () => {
                reset()
                if (fileInputRef.current) fileInputRef.current.value = ''
                if (imageInputRef.current) imageInputRef.current.value = ''
                if (scheduleInputRef.current) scheduleInputRef.current.value = ''
            },
        })
    }

    return (
        <form
            id="createannouncement"
            className="defcontainer"
            onSubmit={handleSubmit}
        >
            <div id="createannouncementcontainer1">
                <img src={Announcementprofileimg} alt="Profile" />

                <textarea
                    placeholder="Write an announcement....."
                    rows={1}
                    value={data.content}
                    onInput={handleInput}
                />
            </div>
            {errors.content && <div className="error">{errors.content}</div>}

            {/* Selection Previews */}
            {(data.image || data.attachment || data.scheduled_at) && (
                <div className="previews">
                    {data.image && (
                        <div className="preview-item">
                            <span>Image: {data.image.name}</span>
                            <button type="button" onClick={() => removeFile('image')}>✕</button>
                        </div>
                    )}

                    {data.attachment && (
                        <div className="preview-item">
                            <span>File: {data.attachment.name}</span>
                            <button type="button" onClick={() => removeFile('attachment')}>✕</button>
                        </div>
                    )}

                    {data.scheduled_at && (
                        <div className="preview-item">
                            <span>Scheduled for: {data.scheduled_at}</span>
                            <button type="button" onClick={() => removeFile('schedule')}>✕</button>
                        </div>
                    )}
                </div>
            )}

            <div id="createannouncementcontainer2">
                {/* Attachment */}
                <img
                    src={Attachmentimg}
                    alt="Attachment"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ cursor: 'pointer' }}
                />
                <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleAttachmentChange}
                />

                {/* Image */}
                <img
                    src={Imageimg}
                    alt="Image"
                    onClick={() => imageInputRef.current?.click()}
                    style={{ cursor: 'pointer' }}
                />
                <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                />

                {/* Schedule */}
                <img
                    src={Padimg}
                    alt="Schedule"
                    onClick={handleSchedule}
                    style={{ cursor: 'pointer' }}
                />
                <input
                    ref={scheduleInputRef}
                    type="datetime-local"
                    value={data.scheduled_at}
                    onChange={(e) => setData('scheduled_at', e.target.value)}
                    style={{
                        position: 'absolute',
                        opacity: 0,
                        width: 0,
                        height: 0,
                        pointerEvents: 'none',
                    }}
                />

                {/* Submit Button */}
                <button type="submit" disabled={processing}>
                    {processing ? 'Posting...' : 'Post'}
                </button>
            </div>
        </form>
    )
}