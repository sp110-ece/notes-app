'use client';

import React, { useEffect, useState } from 'react';
import SignOut from '@/pages/doSignOut';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import Sidebar from '@/componenets/sidebar';
import { getAccessToken } from '@/lib/auth';




type Note = {
  ID: string;
  title: string;
  content: string;
  createdAt: number;
}

type ResourceItem = {
  title: string;
  url: string;
}

type SearchResults = {
  items: ResourceItem[];
}
const Dashboard = () => {
  const [desc, setTitle] = useState('');
  const [idToken, setIdToken] = useState<string | null>(null);
  const [ID, setID] = useState<string>(() => crypto.randomUUID());
  const router = useRouter();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [summary, setSummary] = useState('');
  const [resources, setResources] = useState<SearchResults>({ items: [] });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newDisabled, setDisabled] = useState(false)


  useEffect(() => {
    const validate = async() => {
      try {
        const temp = await getAccessToken();
        const tempUser = await getCurrentUser();

        if (!temp || !tempUser) {
          router.push('/')
        }
      }
      catch {
        router.push('/');
      }
    }
    validate();  
    
  }, [router])

  useEffect(() => {
    const loadSession = async () => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();
        if (token) setIdToken(token);
      } catch {
        //console.error('User not logged in or token fetch failed:', err);
        setError("Token fetch failed");
      }
    };
    loadSession();
  }, []);

  useEffect(() => {
    if (!idToken) return;
    const fetchNote = async () => {
    const res = await fetch('/api/getNotes', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setNotes(data);
    } else {
      //console.error('Error fetching notes');
      setError("Error fetching notes");
    };
    }
    fetchNote();
  }, [idToken]);
  
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3500);
      return () => clearTimeout(timer); 
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 3500);
      return () => clearTimeout(timer); 
    }
  }, [success]);


  // const handleSelectNote = async (note: Note) => {
  //   setSelectedNote(note);
  //   setTitle(note.title);
  //   setContent(note.content);
  //   setID(note.ID);
  //   setResources({ items: [] })
  //   setSummary('')
  // }
  async function getSummary(content: string) {
    const estimateToken = (text: string) => Math.ceil(text.trim().length / 5);
    const MAX_TOKENS = 1000;

    if (estimateToken(content) > MAX_TOKENS) {
      // throw new Error('Input too long to summarize');
      setError("The note is too long to summarize");
    }
    const res = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: content }),
    });
    if (!res.ok) {
      //throw new Error('failed to get summary');
      setError("Failed to get summary");
    }

    const data = await res.json();
    setSummary(data.summary);
    getResources(data.summary)
    return data;
  }

  async function getResources(summary: string) {
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: summary }),
    });
    if (!res.ok) {
      throw new Error('failed to get resources');
      setError("Failed to get related links. Try again later!")
    }

    const resources = await res.json();
    setResources({ items: resources });
    //console.log(resources);
    return resources;
    
  }

  const handleNewNote = async () => {
    setSelectedNote(null);
    setTitle('');
    setContent('');
    setID(crypto.randomUUID());
    setSummary('');
    setResources({ items: [] });
  };
  const handleSubmit = async () => {
    if (!idToken || !content || !desc) {
      //alert('Title and content required');
      setError("Title AND Content requried to save")
      return;
    }
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        ID,
        title: desc,
        content: content,
      }),
    });

    if (res.ok) {
      // alert('Note Saved!');
      setSuccess("Note saved!");
      getSummary(content)
      
    

    const updatedNotes = await fetch('/api/getNotes', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${idToken}`,
      }
    });

    const updatedData = await updatedNotes.json();
    setNotes(updatedData);

    setDisabled(true)
    const timer = setTimeout(() => {
      setDisabled(false);
      console.log(newDisabled)
    }, 3000);
    return() => clearTimeout(timer);
    


    
  }
  else {
    const err = await res.json();
    alert('Error: ' + err.error);
  }
  };

  return (
  <>
    <div className="flex min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] font-sans">
      <Sidebar 
        notes={notes}
        selectedNote={selectedNote}
        onSelectNote={(note: Note) => {
          setSelectedNote(note);
          setTitle(note.title);
          setContent(note.content)
          setID(note.ID);
          setResources({ items: [] })
          setSummary('')
          

        }} 
        
      />
      <main className="flex flex-col items-center justify-start flex-1 p-10 space-y-8 min-h-screen">
        <div className="absolute top-5 right-5">
          <SignOut />
        </div>

        <h1 className="text-5xl font-extrabold select-none">
          What&apos;s on your mind...
        </h1>
        <div style={{ display: 'flex', gap: '1rem', width: '100%', flexGrow: 1, overflow: 'hidden', height: '75vh'}}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: "0", flexGrow: 1, overflowY: 'auto', height: '75vh'}}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button onClick={handleSubmit} style={{resize: 'none' }}>Save Note</button>
                  <button onClick={handleNewNote} disabled={newDisabled}>New Note</button>
                  <div style={{ minWidth: '200px', color: 'red', fontSize: '1rem' }}>
                    <span style={{color: 'red'}}> {error || <span>&nbsp;</span>}</span>
                    <span style={{color: 'green'}}> {success || <span>&nbsp;</span>}</span>
                  </div>
                  <div style={{ minWidth: '200px', color: 'green', fontSize: '1rem' }}>
                    
                  </div>
                </div>
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Write your title here..."
                  style={{ 
                    width: '100%', 
                    ...(error && desc === '' ? {borderColor: 'red'} : {}) 
                  }}
                  className={'border border-red-500'}
                  
                />
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your note here..."
                    style={{ 
                    width: '100%', 
                    ...(error && content === '' ? {borderColor: 'red'} : {}),
                    flexGrow: '1' 
                  }}
                    className={`w-full ${error && desc === '' ? 'border border-red-500' : ''}`}
                  />   
                </div>
              
            </div>
            <div style={{ padding: '1rem', flex: 1, height: '75vh'}}>
              <div style={{ padding: '1rem', minHeight: 0, borderRadius: '8px', background: 'var(--color-accent-light)', color: 'var(--color-foreground)', marginBottom: '1rem', flex: 1, height: '50%' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '100', marginBottom: '0.5rem' }}>Summary</h2>
                <p style={{ color: 'var(--color-foreground)' }}>{summary || ''}</p>
              </div>
              <div>
              </div>
              <div style={{ resize: 'none', minHeight: 0, padding: '1rem', borderRadius: '8px', background: 'var(--color-accent-light)', color: 'var(--color-foreground)', flex: 1, height: '50%', overflowY: 'auto'}}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '100', marginBottom: '0.5rem' }}>Resources</h2>
                <ul style={{ color: 'var(--color-foreground)' }}>
                  {resources && resources.items && resources.items.map((item, index) => (
                    <li key={index}>
                      {item.title} : <a href={item.url} style={{ wordBreak: 'break-word' }}>{item.url}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
      </main>
    </div>
  </>
);
};

export default Dashboard;
