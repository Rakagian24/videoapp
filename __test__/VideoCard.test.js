import React from 'react';
import { render, screen } from '@testing-library/react';
import VideoCard from '../components/VideoCard';

jest.mock('next-auth/react', () => {
  return {
    SessionProvider: ({ children }) => children,
    useSession: () => ({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
      },
      status: 'authenticated',
    }),
  };
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

const video = {
  id: 1,
  filename: 'test.mp4',
  description: 'Test video',
  created_at: new Date().toISOString(),
  username: 'testuser',
  likes_count: 0,
  comments_count: 0,
};

describe('VideoCard', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders video description and username', () => {
    render(<VideoCard video={video} />);
    expect(screen.getByText(/Test video/i)).toBeInTheDocument();
    expect(screen.getByText(/@testuser/i)).toBeInTheDocument();
  });

  it('shows likes and comments count', () => {
    render(
      <VideoCard video={{ ...video, likes_count: 5, comments_count: 2 }} />
    );
    expect(screen.getByText(/❤️ 5/i)).toBeInTheDocument();
    expect(screen.getByText(/💬 2/i)).toBeInTheDocument();
  });
});
