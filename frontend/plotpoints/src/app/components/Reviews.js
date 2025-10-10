import Comment from "./Comment";
import CommentList from "./CommentList";
export default function Reviews() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center w-3/4 h-30 border-2 rounded-md p-3">
        {/* Avatar circle */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-200 border-2 m-2 cursor-pointer shrink-0">
          {/*placeholder image*/}
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
        <div className="flex flex-col mx-5 justify-between h-full grow">
          <div>
            <p className="underline underline-offset-4">Anonymous</p>
            {/* 100 characters */}
            <p className="mt-3 text-gray-700 text-sm">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the{" "}
            </p>
          </div>
          <div className="flex items-center">
            {/* # of ratings */}
            <p className="mr-3 text-sm text-gray-700">+ 1000</p>
            {/* plus */}
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
        </div>
      </div>
          <div className="flex items-center">
          {/*CommentsList here (need to finish component)*/}
      </div>
      <Comment username="vince" text="test"></Comment>
    </div>
  );
}
