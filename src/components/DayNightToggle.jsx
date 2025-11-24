
// old components/DayNightToggle.jsx
// export const DayNightToggle = ({ isDay, setIsDay }) => {
//   return (
//     <label className="relative inline-flex items-center cursor-pointer select-none">
//       {/* Hidden Checkbox (controls the toggle) */}
//       <input
//         type="checkbox"
//         className="sr-only peer"
//         checked={!isDay}              // night = checked
//         onChange={() => setIsDay(!isDay)}
//       />

//       {/* Track */}
//       <div
//         className="
//           w-[72px] h-[72px] rounded-full
//           bg-gradient-to-r 
//           from-yellow-300 to-orange-400
//           peer-checked:from-blue-400 peer-checked:to-indigo-500
//           transition-all duration-500
//           relative
//         "
//       >
//         {/* Thumb */}
//         <div
//           className="
//             absolute top-2 left-2
//             h-14 w-14 rounded-full bg-white shadow-md
//             flex items-center justify-center text-lg
//             transition-all duration-500
//             peer-checked:translate-x-10
//           "
//         >
//           {/* Sun & Moon icons handled by opacity */}
//           <span
//             className={`
//               absolute transition-opacity duration-500 
//               ${isDay ? "opacity-100" : "opacity-0"}
//             `}
//           >
//             ☀️
//           </span>

//           <span
//             className={`
//               absolute transition-opacity duration-500 
//               ${!isDay ? "opacity-100" : "opacity-0"}
//             `}
//           >
//             🌙
//           </span>
//         </div>
//       </div>

//       {/* Optional text label */}
//       {/* <span className="ml-3 text-sm font-medium text-gray-100">
//         Change<hr />Theme/ <hr />
//         Sky
//       </span> */}
//     </label>
//   );
// };

// components/DayNightToggle.jsx
export const DayNightToggle = ({ isDay, setIsDay }) => {
  return (
    <label className="relative inline-block w-32 h-32 cursor-pointer select-none
    hover:scale-105 transition-transform duration-300 transform-gpu">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={!isDay}
        onChange={() => setIsDay(!isDay)}
      />

      {/* Sky Background - Gradient Transition */}
      <div
        className={`
          absolute inset-0 rounded-full overflow-hidden shadow-2xl
          transition-all duration-1000 ease-in-out
          ${isDay 
            ? "bg-gradient-to-br from-sky-300 via-blue-400 to-pink-300" 
            : "bg-gradient-to-br from-indigo-900 via-purple-900 to-black"
          }
        `}
      >
        {/* Rotating Sky Layer for Magic */}
        <div
          className={`
            absolute inset-0 transition-transform duration-1000
            ${isDay ? "rotate-0" : "rotate-180"}
          `}
        >
          {/* Subtle Clouds (Day) */}
          {isDay && (
            <>
              <div className="absolute top-8 left-4 w-16 h-8 bg-white/60 rounded-full blur-xl animate-pulse" />
              <div className="absolute top-12 right-6 w-20 h-10 bg-white/50 rounded-full blur-lg animate-pulse delay-300" />
              <div className="absolute bottom-10 left-8 w-14 h-7 bg-white/40 rounded-full blur-md animate-pulse delay-700" />
            </>
          )}

          {/* Twinkling Stars (Night) */}
          {!isDay && (
            <>
              <div className="absolute top-8 left-10 w-1 h-1 bg-white rounded-full animate-ping" />
              <div className="absolute top-12 right-8 w-1.5 h-1.5 bg-yellow-300 rounded-full shadow-glow animate-pulse delay-200" />
              <div className="absolute bottom-10 left-12 w-1 h-1 bg-white rounded-full animate-ping delay-500" />
              <div className="absolute top-4 right-4 w-0.5 h-0.5 bg-white rounded-full animate-pulse" />
              <div className="absolute bottom-6 right-10 w-1 h-1 bg-blue-200 rounded-full animate-ping delay-300" />
            </>
          )}
        </div>
      </div>

      {/* Celestial Body - Sun/Moon with Glow & Rays */}
      <div
        className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-20 h-20 rounded-full shadow-lg
          flex items-center justify-center
          transition-all duration-1000 ease-in-out
          ${isDay 
            ? "bg-yellow-300 shadow-yellow-400/50 scale-110 rotate-0" 
            : "bg-gray-200 shadow-blue-300/30 scale-90 rotate-0"
          }
        `}
      >
        {/* Sun Rays (Visible in Day) */}
        {isDay && (
          <>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-12 bg-yellow-200/70 rounded-full blur-sm"
                style={{ transform: `rotate(${i * 45}deg)` }}
              />
            ))}
          </>
        )}

        {/* Cartoon Face */}
        <div className="relative z-10 flex flex-col items-center gap-1">
          {/* Eyes */}
          <div className="flex gap-3">
            <div className={`w-2 h-3 rounded-full ${isDay ? "bg-orange-600" : "bg-indigo-900"}`} />
            <div className={`w-2 h-3 rounded-full ${isDay ? "bg-orange-600" : "bg-indigo-900"}`} />
          </div>
          {/* Mouth */}
          <div
            className={`
              w-8 h-3 rounded-b-full
              transition-all duration-500
              ${isDay ? "bg-orange-600" : "bg-indigo-900 rotate-0"}
            `}
          />
        </div>

        {/* Moon Craters (Visible in Night) */}
        {!isDay && (
          <>
            <div className="absolute top-4 left-6 w-4 h-4 bg-gray-400/50 rounded-full" />
            <div className="absolute bottom-6 right-8 w-3 h-3 bg-gray-400/50 rounded-full" />
            <div className="absolute top-10 left-10 w-2 h-2 bg-gray-400/50 rounded-full" />
          </>
        )}
      </div>
    </label>
  );
};