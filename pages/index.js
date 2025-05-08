import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import VideoCard from '../components/VideoCard';
import { useSession } from 'next-auth/react';
import Modal from 'react-modal';

Modal.setAppElement('#__next'); // Set the app element for accessibility

export default function Home() {
  const [videos, setVideos] = useState([]);
  const { data: session } = useSession();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const fetchVideos = async () => {
    const res = await fetch('/api/videos');
    if (res.ok) {
      const data = await res.json();
      setVideos(data);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  async function handleUpload(e) {
    e.preventDefault();
    setUploading(true);
    setUploadError(null);

    const formData = new FormData(e.target);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      e.target.reset();
      fetchVideos();
      setModalIsOpen(false); // Close modal after upload
    } else {
      const data = await res.json();
      setUploadError(data.error || 'Upload failed');
    }
    setUploading(false);
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <main className="max-w-xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-white text-center">All Videos</h1>

        {session && (
          <button onClick={() => setModalIsOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 mb-4">
            Upload Video
          </button>
        )}

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          className="modal"
          overlayClassName="overlay"
        >
          <h2 className="text-xl font-bold mb-4">Upload Video</h2>
          <form onSubmit={handleUpload} encType="multipart/form-data">
            <div className="mb-2">
              <label htmlFor="video" className="block mb-1">Upload Video</label>
              <input type="file" id="video" name="video" accept="video/*" required className="w-full"/>
            </div>
            <div className="mb-2">
              <label htmlFor="description" className="block mb-1">Description</label>
              <input type="text" id="description" name="description" maxLength={200} className="w-full p-2 rounded text-gray-800"/>
            </div>
            <button type="submit" disabled={uploading} className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2">
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
          </form>
        </Modal>

        {!session && (
          <p className="text-center text-gray-400 mb-4">You must be logged in to upload videos.</p>
        )}

        {videos.length === 0 && <p className="text-gray-400 text-center">No videos available</p>}

        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </main>
    </div>
  );
}
