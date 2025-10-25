export default function FollowProfile({ name, desc }) {
  return (
    <div
      className="group m-2 mt-5 p-4 rounded-xl shadow-md blue 
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                 flex justify-between items-center"
    >
      {/* Profile Section */}
      <div className="flex flex-row items-center">
        <div className="w-16 h-16 rounded-full bg-gray-200 border-2 cursor-pointer shrink-0" />
        <div className="flex flex-col ml-5 text-left">
          <p className="text-lg underline underline-offset-3">
            {name || "Your Name"}
          </p>
          <p className="text-sm text-gray-600">{desc || "Your Description"}</p>
        </div>
      </div>

      {/* Buttons (only visible on hover) */}
      <div className="flex flex-row mr-5 items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {/* Unfollow Button */}
        <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            class="size-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
            />
          </svg>
        </button>

        {/* Block Button */}
        <button className="px-3 py-1 bg-red-600 rounded hover:bg-red-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
