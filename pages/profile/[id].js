   import React from 'react'; 
   import { useRouter } from 'next/router';
   import { useEffect, useState } from 'react';
   import NavBar from '../../components/NavBar';
   import VideoCard from '../../components/VideoCard';
   import { useSession } from 'next-auth/react';

   export default function Profile() {
     const { data: session, status } = useSession();
     const router = useRouter();
     const { id } = router.query;
     const [videos, setVideos] = useState([]);
     const [username, setUsername] = useState('');

     useEffect(() => {
       if (!id) return;

       async function fetchUserVideos() {
         const res = await fetch(`/api/videos?userId=${id}`);
         if (res.ok) {
           const data = await res.json();
           setVideos(data);
           if (data.length > 0) {
             setUsername(data[0].username);
           } else {
             setUsername('User ');
           }
         }
       }

       fetchUserVideos();
     }, [id]);

     if (status === "loading") {
       return <p>Loading...</p>;
     }

     return (
       <div className="min-h-screen bg-gray-900">
         <NavBar />
         <main className="max-w-xl mx-auto p-4">
           <h1 className="text-3xl font-bold mb-4 text-white text-center">@{username}'s Videos</h1>
           {videos.length === 0 && <p className="text-gray-400 text-center">No videos uploaded yet</p>}
           {videos.map((video) => (
             <VideoCard key={video.id} video={video} />
           ))}
         </main>
       </div>
     );
   }
   