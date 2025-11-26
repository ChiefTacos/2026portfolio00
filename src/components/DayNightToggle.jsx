

export const DayNightToggle = ({ isDay, setIsDay }) => {
  return (
    <label className="absolute inline-block w-32 h-32 cursor-pointer select-none
    hover:scale-105 transition-transform duration-300 transform-gpu left-[-16px] bottom-[-15px] ">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={!isDay}
        onChange={() => setIsDay(!isDay)}
      />

      <div
        className={`
          absolute inset-0 rounded-full overflow-hidden shadow-2xl
          transition-all duration-1000 ease-in-out scale-50
          ${isDay 
            ? "bg-gradient-to-br from-sky-300 via-blue-400 to-pink-300" 
            : "bg-gradient-to-br from-indigo-900 via-purple-900 to-black"
          }
        `}
      >
        <div
          className={`
            absolute inset-0 transition-transform duration-1000 scale-50
            ${isDay ? "rotate-0" : "rotate-180"}
          `}
        >
          {isDay && (
            <>
              <div className="absolute top-8 left-4 w-16 h-8 bg-white/60 rounded-full blur-xl animate-pulse" />
              <div className="absolute top-12 right-6 w-20 h-10 bg-white/50 rounded-full blur-lg animate-pulse delay-300" />
              <div className="absolute bottom-10 left-8 w-14 h-7 bg-white/40 rounded-full blur-md animate-pulse delay-700" />
            </>
          )}

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

        <div className="relative z-10 flex flex-col items-center gap-1">
          <div className="flex gap-3">
            <div className={`w-2 h-3 rounded-full ${isDay ? "bg-orange-600" : "bg-indigo-900"}`} />
            <div className={`w-2 h-3 rounded-full ${isDay ? "bg-orange-600" : "bg-indigo-900"}`} />
          </div>
          <div
            className={`
              w-8 h-3 rounded-b-full
              transition-all duration-500
              ${isDay ? "bg-orange-600" : "bg-indigo-900 rotate-0"}
            `}
          />
        </div>

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