'use client';

import React, { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

type Note = {
  ID: string;
  title: string;
  content: string;
  createdAt: number;
};

type SidebarProps = {
  notes: Note[]
  onSelectNote: (note: Note) => void;
  selectedNote: Note | null;
};

const Sidebar: React.FC<SidebarProps> = ({ notes, onSelectNote, selectedNote }) => {
 
  return (
    <div
      style={{
        width: '20vw',
        height: '100vh',
        backgroundColor: 'var(--color-sb-background)',
        padding: '1rem',
        overflowY: 'auto',
        borderRight: '1px solid var(--color-border)',
        color: 'var(--color-foreground)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <h2
        style={{
          marginBottom: '1rem',
          color: 'var(--color-foreground)',
          fontWeight: 'light',
          fontSize: '1rem',
          
        }}
      >
        Your Notes
      </h2>
      <h2
      style={{
          marginBottom: '1rem',
          color: 'var(--color-foreground)',
          fontWeight: 'light',
          fontSize: '0.75rem',
          
        }}>
        Recents
      </h2>

      {notes.length === 0 && <p>No notes found.</p>}
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {[...notes]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((note) => (
          
          <li
            key={note.ID}
            className={'note-item'}
            onClick={() => onSelectNote(note)}
            title={note.title}
          >
            <strong>{note.title || 'Untitled'}</strong>
            <br />
            <small style={{ color: 'var(--color-foreground)', fontSize: '0.75rem'}}>
              {new Date(note.createdAt).toLocaleDateString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
