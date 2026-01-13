  import { create } from 'zustand'
  import { auth } from '../firebase';
  import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged,
    signOut 
  } from "firebase/auth";

  export const useStore = create((set) => ({
    // Music State
          isPlaying: false,
          currentTrackIndex: 0,
          currentTime: 0,      // New
          duration: 0,// New
          // NEW: Navigation State
  activePlaylist: "Now Playing",   // What you see in the UI
  playingPlaylist: "Now Playing",  // What is coming out of the speakers
            // Your MP3s go in the /public/music folder
        // Playlists Object
          playlists: {
            "Songs": [
              { title: "Blind Ambition", url: "/music/starter1.mp3", artist: "Admin" },
              { title: "West Coast Cul-de-sac", url: "/music/starter2.mp3", artist: "Admin" },
              { title: "Almond Joy", url: "/music/starter3.mp3", artist: "Admin" }
            ]
          },

    // Actions
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  nextTrack: () => set((state) => {
    const currentList = state.playlists[state.playingPlaylist] || [];
    if (currentList.length === 0) return { isPlaying: false };
    return { 
      currentTrackIndex: (state.currentTrackIndex + 1) % currentList.length,
      isPlaying: true 
    };
  }),

  prevTrack: () => set((state) => {
    const currentList = state.playlists[state.playingPlaylist] || [];
    if (currentList.length === 0) return { isPlaying: false };
    return { 
      currentTrackIndex: (state.currentTrackIndex - 1 + currentList.length) % currentList.length,
      isPlaying: true 
    };
  }),

  // Selection: Sets BOTH which song and which playlist is "live"
  selectTrack: (playlistName, index) => set({ 
    playingPlaylist: playlistName,
    currentTrackIndex: index, 
    isPlaying: true 
  }),

  setActivePlaylist: (name) => set({ activePlaylist: name }),

  addPlaylist: (name) => set((state) => {
    const currentCount = Object.keys(state.playlists).length;
    if (currentCount >= 10) return state; // Max 9 extra + default
    return {
      playlists: { ...state.playlists, [name]: [] },
      activePlaylist: name // Jump to the new one
    };
  }),

  addTrackToPlaylist: (playlistName, track) => set((state) => ({
    playlists: {
      ...state.playlists,
      [playlistName]: [...state.playlists[playlistName], track]
    }
  })),

  setCurrentTime: (time) => set({ currentTime: time }),
    setDuration: (dur) => set({ duration: dur }),



    // Notes State OLD
    // notes: [],

    // addNote: (text) => set((state) => ({ 
    //   notes: [...state.notes, text] 
    // })),
    
    // removeNote: (index) => set((state) => ({
    //   notes: state.notes.filter((_, i) => i !== index)
    // })),


    // Notes State: Now an object like { "container-1": ["note1"], "container-2": ["note2"] }
    notes: {
      "default": [] 
    },

    addNote: (containerId, text) => set((state) => ({ 
      notes: {
        ...state.notes,
        [containerId]: [...(state.notes[containerId] || []), text]
      }
    })),
    
    removeNote: (containerId, noteIndex) => set((state) => ({
      notes: {
        ...state.notes,
        [containerId]: state.notes[containerId].filter((_, i) => i !== noteIndex)
      }
    })),
    


    // sign in
  user: null,
    authLoading: true,

    // Initialize Auth Listener (Call this once when app starts)
    initAuth: () => {
      onAuthStateChanged(auth, (user) => {
        set({ user, authLoading: false });
      });
    },

  login: async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      // Standardize the error message
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        alert("Invalid email or password. Please try again.");
      } else if (error.code === 'auth/user-not-found') {
        alert("No account found with this email.");
      } else {
        alert(error.message);
      }
    }
  },

    signup: async (email, password) => {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (error) {
        alert(error.message);
      }
    },

  resetPassword: async (email) => {
    try {
      const { sendPasswordResetEmail } = await import("firebase/auth");
      await sendPasswordResetEmail(auth, email);
      alert("Reset link sent to your email!");
    } catch (error) {
      alert(error.message);
    }
  },

  logout: () => signOut(auth),

  }))

