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
        // Your MP3s go in the /public/music folder
  tracks: [
    { title: "Blind Ambition", url: "/music/starter1.mp3", artist: "Admin" },
    { title: "West Coast Cul-de-sac", url: "/music/starter2.mp3", artist: "Admin" },
    { title: "Almond Joy", url: "/music/starter3.mp3", artist: "Admin" }
  ],

  // Actions
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  // Cycles forward and loops to start
  nextTrack: () => set((state) => ({ 
    currentTrackIndex: (state.currentTrackIndex + 1) % state.tracks.length,
    isPlaying: true // Auto-play when skipping
  })),

  // Cycles backward and loops to end
  prevTrack: () => set((state) => ({ 
    currentTrackIndex: (state.currentTrackIndex - 1 + state.tracks.length) % state.tracks.length,
    isPlaying: true 
  })),

 setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (dur) => set({ duration: dur }),


// This will be used when we add the upload feature later
  addTrack: (track) => set((state) => ({ tracks: [...state.tracks, track] })),

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
      alert(error.message);
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

