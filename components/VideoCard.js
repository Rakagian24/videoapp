import React from 'react'; 
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function VideoCard({ video }) {
  const { data: session } = useSession();
  const [likesCount, setLikesCount] = useState(video.likes_count || 0);
  const [commentsCount, setCommentsCount] = useState(video.comments_count || 0);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
  }, [video.id]);

  async function toggleLike() {
    if (!session) return alert('Login to like');

    const res = await fetch(`/api/videos/${video.id}/like`, { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      if (data.liked) {
        setLikesCount((c) => c + 1);
        setLiked(true);
      } else {
        setLikesCount((c) => c - 1);
        setLiked(false);
      }
    }
  }

  async function loadComments() {
    const res = await fetch(`/api/videos/${video.id}/comments`);
    const data = await res.json();
    if (res.ok) {
      setComments(data);
      setShowComments(true);
    }
  }

  async function postComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
  
    if (!session) {
      alert('You must be logged in to comment');
      return;
    }
  
    const res = await fetch(`/api/videos/${video.id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',},
      body: JSON.stringify({ comment: commentText }),
    });
  
    if (res.ok) {
      setCommentText('');
      setCommentsCount((c) => c + 1);
      loadComments();
    } else {
      const errorData = await res.json();
      console.error('Failed to post comment:', errorData);
      alert('Failed to post comment: ' + errorData.error);
    }
  }  

  return (
    <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-3 mb-6">
      <p className="text-gray-300 mb-1 font-semibold">@{video.username}</p>
      <video
        src={video.filename}
        controls
        className="w-full rounded mb-2 max-h-[400px] object-contain"
      />
      <p className="mb-2 text-gray-200">{video.description}</p>
      <div className="flex items-center space-x-4 mb-2">
        <button
          onClick={toggleLike}
          className={`px-3 py-1 rounded ${liked ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          ❤️ {likesCount}
        </button>
        <button
          onClick={showComments ? () => setShowComments(false) : loadComments}
          className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
        >
          💬 {commentsCount}
        </button>
      </div>
      {showComments && (
        <div className="max-h-48 overflow-y-auto bg-gray-700 p-2 rounded">
          {comments.length === 0 && <p className="text-gray-300">No comments yet</p>}
          {comments.map((c) => (
            <div key={c.id} className="mb-1 border-b border-gray-600 pb-1">
              <span className="font-semibold">@{c.username}:</span> {c.comment}
            </div>
          ))}
          {session && (
            <form onSubmit={postComment} className="mt-2 flex space-x-2">
              <input
                type="text"
                placeholder="Add comment..."
                className="flex-1 rounded px-2 py-1 text-black"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit" className="bg-blue-600 px-3 rounded">Send</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
