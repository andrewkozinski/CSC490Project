export default function Reviews() {
  return (
    <div className="flex-col">
      <div className="flex items-center w-full h-30 border-2 rounded-md p-3 cursor-pointer">
        {/* Avatar circle */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 border-2 m-2">
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
        {/* Example review content */}
        <div className="flex flex-col mx-5">
          <p className="font-medium text-sm">Anonymous</p>
          <p className="text-gray-700 text-sm">This movie was great!</p>
        </div>
      </div>
      <div className="flex h-10 border-2 border-t-0 rounded-md justify-between px-3">
        <div className="flex my-2 mx-2">
          {/* # of ratings */}
          <p className="mr-3">+1000</p>
          {/* plus */}
          <button className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>

          <p>|</p>

          {/* minus */}
          <button className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
        </div>
        <button>
        <div className="flex items-center">
          <p>Comments</p>
          <p className="cursor-pointer p-1">+</p>
        </div>
        </button>
      </div>
    </div>
  );
}
