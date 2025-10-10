export default function Comment({ username = "Anonymous", text = "No comment" }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center w-full h-20 border-1 shadow-xl rounded-md m-1 p-3">
        {/* Avatar circle */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-200 border-2 m-2 cursor-pointer mr-5 shrink-0">
          {/*placeholder*/}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-8 h-8 text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </div>
        <div>
          <p className="underline underline-offset-4 mb-2">{username}</p>
          <p className="text-sm text-gray-700">{text}</p>
        </div>
      </div>
    </div>
  );
}
