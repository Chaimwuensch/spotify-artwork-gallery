import { useNavigate } from "react-router-dom";

export default function TrackCard({ track, index, liked, onLike }) {
  const navigate = useNavigate();

  return (
    <div
      className="card-hover fade-up glass rounded-xl overflow-hidden cursor-pointer group relative"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Album art */}
      <div
        className="relative"
        onClick={() => navigate(`/track/${track.id}`, { state: { track } })}
      >
        {(() => {
          const imageUrl = track.album.images?.[1]?.url || track.album.images?.[0]?.url || "https://placehold.co/300x300?text=No+Image";
          console.log(`TrackCard ${track.name}: `, { imageUrl, album: track.album, imagesLength: track.album?.images?.length });
          return (
            <img
              src={imageUrl}
              alt={track.album.name}
              className="w-full aspect-square object-cover"
              onError={(e) => {console.error(`Image failed to load: ${e.target.src}`); e.target.src = "https://placehold.co/300x300?text=Image+Not+Found"}}
            />
          );
        })()}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-green-400 rounded-full p-2 shadow-lg">
            <svg width="14" height="14" fill="black" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Rank badge */}
        {index < 3 && (
          <div className="absolute top-1.5 left-1.5 bg-green-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            #{index + 1}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2">
        <p className="font-semibold text-[11px] truncate leading-tight">{track.name}</p>
        <p className="text-gray-500 text-[10px] truncate mt-0.5">
          {track.artists.map((a) => a.name).join(", ")}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={(e) => { e.stopPropagation(); onLike(track.id); }}
            className={`transition-all ${liked ? "text-green-400 scale-110" : "text-gray-600 hover:text-white"}`}
          >
            <svg
              width="14"
              height="14"
              fill={liked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          <button
            onClick={() => navigate(`/track/${track.id}`, { state: { track } })}
            className="text-[10px] text-green-400 hover:text-green-300 font-medium transition-colors"
          >
            Art →
          </button>
        </div>
      </div>
    </div>
  );
}