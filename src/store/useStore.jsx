  import { create } from 'zustand'
  import { auth, db } from '../firebase';
  import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged,
    signOut 
  } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";


  export const useStore = create((set, get) => ({
    // Music State
          isPlaying: false,
          currentTrackIndex: 0,
          currentTime: 0,      
          duration: 0,
          // NEW: Navigation State
  activePlaylist: "Now Playing",   // What you see in the UI
  playingPlaylist: "Now Playing",  // What is coming out of the speakers
            // Your MP3s go in the /public/music folder
        // Playlists Object
          playlists: {
            "Now Playing": [] // Empty array instead of the 3 starter songs
           
          },
      // --- AUTH STATE ---
        user: null,
        authLoading: true,
    // --- ACTIONS ---

          // NEW: Fetch user data from Firestore
          initAuth: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user, authLoading: false });
      if (user) {
        // Automatically fetch data when user logs in
        get().fetchUserData(user); 
      } else {
        // Clear data on logout
        set({ 
          playlists: { "Now Playing": [] }, 
          notes: { "default": [] } 
        });
      }
    });
  },

  fetchUserData: async (user) => {
    if (!user) return;
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Data loaded from cloud:", data); // Add this to debug!
        set({ 
          playlists: data.playlists || { "Now Playing": [] },
          notes: data.notes || { "default": [] }
        });
      } else {
        // New User: Create their initial doc in Firestore
        await setDoc(docRef, {
          playlists: { "Now Playing": [] },
          notes: { "default": [] }
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  },

  addTrackToPlaylist: async (playlistName, track) => {
    const { user, playlists } = get(); // get() now works!
    
    const updatedPlaylists = {
      ...playlists,
      [playlistName]: [...(playlists[playlistName] || []), track]
    };

    set({ playlists: updatedPlaylists });

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { playlists: updatedPlaylists }, { merge: true });
      } catch (error) {
        console.error("Cloud save failed:", error);
      }
    }
  },

  addPlaylist: async (name) => {
    const { user, playlists } = get();
    if (Object.keys(playlists).length >= 10) return;

    const updatedPlaylists = { ...playlists, [name]: [] };
    set({ playlists: updatedPlaylists, activePlaylist: name });

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { playlists: updatedPlaylists }, { merge: true });
      } catch (error) {
        console.error("Cloud save failed:", error);
      }
    }
  },


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
  setCurrentTime: (time) => set({ currentTime: time }),
    setDuration: (dur) => set({ duration: dur }),



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

