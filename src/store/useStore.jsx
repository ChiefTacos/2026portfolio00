  import { create } from 'zustand'
  import { auth, db } from '../firebase';
  import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged,
    signOut 
  } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { deleteObject, ref as storageRef } from "firebase/storage";

  export const useStore = create((set, get) => ({
    // Music State
          isPlaying: false,
          currentTrackIndex: 0,
          currentTime: 0,      
          duration: 0,
           activePlaylist: "Songs",   // What you see in the UI
           playingPlaylist: "Songs",  // What is coming out of the speakers
            // Your MP3s go in the /public/music folder
        // Playlists Object
          playlists: {
            "Songs": [] // Empty array instead of the 3 starter songs
           
          },
          volume: 1,
          repeatMode: 'off', // 'off' | 'one' | 'all'
          isShuffled: false,
      // --- AUTH STATE ---
        user: null,
        authLoading: true,

            // Notes State: Now an object like { "container-1": ["note1"], "container-2": ["note2"] }
    notes: {
      "default": [] 
    },
    boardList: [{ id: "default", name: "Board 1" }],

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
          playlists: { "Songs": [] }, 
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
      set({ 
        playlists: data.playlists || { "Songs": [] },
        notes: data.notes || { "default": [] },
        // FIX: Ensure we fall back to an object, not a string
        boardList: data.boardList || [{ id: "default", name: "Board 1" }],
      });
    } else {
      await setDoc(docRef, {
        playlists: { "Songs": [] },
        notes: { "default": [] },
        boardList: [{ id: "default", name: "Board 1" }], // FIX: Object format
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



  // NEW VOLUME AND SHUFFLE/REPEAT
preMuteVolume: 1, // Store the volume level before muting

  setVolume: (val) => {
    set({ volume: val, preMuteVolume: val > 0 ? val : get().preMuteVolume });
    if (window.__AUDIO_ENGINE__) window.__AUDIO_ENGINE__.setVolume(val);
  },

  toggleMute: () => {
    const { volume, preMuteVolume, setVolume } = get();
    if (volume > 0) {
      setVolume(0); // Mute
    } else {
      setVolume(preMuteVolume || 0.5); // Unmute to previous level or 50%
    }
  },
  toggleShuffle: () => set((state) => ({ isShuffled: !state.isShuffled })),

  toggleRepeat: () => set((state) => {
    const modes = ['off', 'all', 'one'];
    const nextIndex = (modes.indexOf(state.repeatMode) + 1) % modes.length;
    return { repeatMode: modes[nextIndex] };
  }),

   togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      // nextTrack: () => {
      //   const state = get();
      //   const currentList = state.playlists[state.playingPlaylist] || [];
      //   if (currentList.length === 0) return set({ isPlaying: false });

      //   // 1. Handle REPEAT ONE
      //   if (state.repeatMode === 'one') {
      //     if (window.__AUDIO_ENGINE__) window.__AUDIO_ENGINE__.restart();
      //     return set({ isPlaying: true, currentTime: 0 });
      //   }

      //   let nextIndex;
      //   // 2. Handle SHUFFLE
      //   if (state.isShuffled && currentList.length > 1) {
      //     let randomIndex = state.currentTrackIndex;
      //     while (randomIndex === state.currentTrackIndex) {
      //       randomIndex = Math.floor(Math.random() * currentList.length);
      //     }
      //     nextIndex = randomIndex;
      //   } else {
      //     nextIndex = state.currentTrackIndex + 1;
      //   }

      //   // 3. Handle End of List / REPEAT ALL
      //   if (nextIndex >= currentList.length) {
      //     if (state.repeatMode === 'all') {
      //       nextIndex = 0;
      //     } else {
      //       // Stop playback if not repeating all
      //       return set({ isPlaying: false, currentTrackIndex: 0 });
      //     }
      //   }

      //   set({ currentTrackIndex: nextIndex, isPlaying: true });
      // }, 

nextTrack: () => {
    const state = get();
    const currentList = state.playlists[state.playingPlaylist] || [];
    if (currentList.length === 0) return set({ isPlaying: false });

    // --- 1. HANDLE REPEAT 'ONE' (Infinite Loop) ---
    if (state.repeatMode === 'one') {
      if (window.__AUDIO_ENGINE__) window.__AUDIO_ENGINE__.restart();
      return set({ isPlaying: true, currentTime: 0 });
    }

    // --- 2. HANDLE "REPEAT ONCE" (The 'all' highlight) ---
    // If repeatMode is 'all', we replay the current index, then flip repeat to 'off'
    if (state.repeatMode === 'all') {
      if (window.__AUDIO_ENGINE__) window.__AUDIO_ENGINE__.restart();
      return set({ 
        isPlaying: true, 
        currentTime: 0, 
        repeatMode: 'off' // Automatically turn off after this repeat
      });
    }

    // --- 3. HANDLE SHUFFLE ---
    let nextIndex;
    if (state.isShuffled && currentList.length > 1) {
      // Pick a random index that isn't the current one
      let randomIndex = state.currentTrackIndex;
      while (randomIndex === state.currentTrackIndex) {
        randomIndex = Math.floor(Math.random() * currentList.length);
      }
      nextIndex = randomIndex;
    } else {
      nextIndex = state.currentTrackIndex + 1;
    }

    // --- 4. END OF PLAYLIST LOGIC ---
    if (nextIndex >= currentList.length) {
      return set({ isPlaying: false, currentTrackIndex: 0 });
    }

    set({ currentTrackIndex: nextIndex, isPlaying: true });
  },
  prevTrack: () => set((state) => {
    const currentList = state.playlists[state.playingPlaylist] || [];
    if (currentList.length === 0) return { isPlaying: false };
    return { 
      currentTrackIndex: (state.currentTrackIndex - 1 + currentList.length) % currentList.length,
      isPlaying: true 
    };
  }),

// deleteTrack: async (playlistName, track) => {
//   const { storage, db, user } = get();
  
//   try {
//     // 1. Delete from Storage
//     const fileRef = storageRef(storage, track.url); // Use the URL to find the file
//     await deleteObject(fileRef);
//     console.log("File deleted from storage");

//     // 2. Delete from Firestore
//     const playlistRef = doc(db, `users/${user.uid}/playlists`, playlistName);
//     await updateDoc(playlistRef, {
//       tracks: arrayRemove(track)
//     });
    
//     // 3. Update local state (Zustand will auto-refresh the UI)
//     set((state) => {
//       const updatedPlaylist = state.playlists[playlistName].filter(t => t.url !== track.url);
//       return {
//         playlists: { ...state.playlists, [playlistName]: updatedPlaylist }
//       };
//     });

//     alert("Track deleted successfully!");
//   } catch (error) {
//     console.error("Delete failed:", error);
//   }
// },
deleteTrack: async (playlistName, track) => {
  // 1. Grab everything from the current state
  const { user, playlists } = get();
  
  // 2. We need to make sure we are using the 'db' we imported at the top of the file
  // If 'db' is undefined here, that's what causes your error.
  if (!user || !db) {
    console.error("User or Database not initialized");
    return;
  }

  try {
    // 3. Delete from Storage
    const { storage } = await import('../firebase'); 
    const fileRef = storageRef(storage, track.url);
    await deleteObject(fileRef).catch(err => console.log("Storage file already gone."));

    // 4. Update the local data
    const updatedPlaylist = playlists[playlistName].filter(t => t.url !== track.url);
    const updatedPlaylists = {
      ...playlists,
      [playlistName]: updatedPlaylist
    };

    // 5. Push the new object to Firestore
    // We use the 'db' imported at the top of your useStore file
    const userDocRef = doc(db, "users", user.uid); 
    
    await updateDoc(userDocRef, { 
      playlists: updatedPlaylists 
    });

    // 6. Update local state ONLY after the DB call succeeds
    set({ playlists: updatedPlaylists });

    alert("Track deleted successfully!");
  } catch (error) {
    console.error("Delete failed details:", error);
    alert("Delete failed: " + error.message);
  }
},







  // Selection: Sets BOTH which song and which playlist is "live"
  selectTrack: (playlistName, index) => set({ 
    playingPlaylist: playlistName,
    currentTrackIndex: index, 
    isPlaying: true 
  }),

  setActivePlaylist: (name) => set({ activePlaylist: name }),
  setCurrentTime: (time) => set({ currentTime: time }),
    setDuration: (dur) => set({ duration: dur }),




// ADD NOTE + CLOUD SYNC
  addNote: async (containerId, text) => {
    const { user, notes } = get();
    const updatedNotes = {
      ...notes,
      [containerId]: [...(notes[containerId] || []), text]
    };
    set({ notes: updatedNotes });
    if (user) {
      await setDoc(doc(db, "users", user.uid), { notes: updatedNotes }, { merge: true });
    }
  },

  // REMOVE NOTE + CLOUD SYNC
  removeNote: async (containerId, noteIndex) => {
    const { user, notes } = get();
    const updatedNotes = {
      ...notes,
      [containerId]: notes[containerId].filter((_, i) => i !== noteIndex)
    };
    set({ notes: updatedNotes });
    if (user) {
      await setDoc(doc(db, "users", user.uid), { notes: updatedNotes }, { merge: true });
    }
  },
    editNote: async (containerId, noteIndex, newText) => {
      const { user, notes } = get();
      const containerNotes = [...(notes[containerId] || [])];
      
      // Update the specific note at the index
      containerNotes[noteIndex] = newText;

      const updatedNotes = {
        ...notes,
        [containerId]: containerNotes
      };

      set({ notes: updatedNotes });

      if (user) {
        try {
          await setDoc(doc(db, "users", user.uid), { notes: updatedNotes }, { merge: true });
        } catch (error) {
          console.error("Failed to edit note in cloud:", error);
        }
      }
    },

addBoard: async (customId) => {
  const { user, boardList } = get();
  const id = customId || `board-${Date.now()}`;
  
  // Pick a random number between 0 and 4
  const randomColorIndex = Math.floor(Math.random() * 5);

  const newBoard = { 
    id, 
    name: `Board ${boardList.length + 1}`,
    colorIndex: randomColorIndex // Store the color preference
  };
  
  const updatedBoards = [...boardList, newBoard];
  
  set({ boardList: updatedBoards });
  if (user) {
    await setDoc(doc(db, "users", user.uid), { boardList: updatedBoards }, { merge: true });
  }
},
//new rename board
renameBoard: async (id, newName) => {
  const { user, boardList } = get();
  const updatedBoards = boardList.map(board => 
    board.id === id ? { ...board, name: newName } : board
  );

  set({ boardList: updatedBoards });
  if (user) {
    await setDoc(doc(db, "users", user.uid), { boardList: updatedBoards }, { merge: true });
  }
},
// NEW: REMOVE BOARD + CLOUD SYNC (FIXED)
removeBoard: async (containerId) => {
  const { user, boardList, notes } = get();
  
  // FIX: Filter by board.id because board is now an object
  const updatedBoards = boardList.filter(board => board.id !== containerId);
  
  const updatedNotes = { ...notes };
  delete updatedNotes[containerId];

  set({ boardList: updatedBoards, notes: updatedNotes });
  
  if (user) {
    try {
      const userDocRef = doc(db, "users", user.uid);
      // We send the new board list and updated notes to Firebase
      await setDoc(userDocRef, { 
        boardList: updatedBoards, 
        notes: updatedNotes 
      }, { merge: true });
    } catch (error) {
      console.error("Failed to delete board from cloud:", error);
    }
  }
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

