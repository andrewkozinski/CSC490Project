export default function FollowProfile({ name, desc }) {
  return (
    <div
      className="m-2 mt-5 p-4 rounded-xl shadow-md blue 
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                 flex"
    >
      {/* Profile Circle */}
      <div className="w-16 h-16 rounded-full bg-gray-200 border-2 cursor-pointer shrink-0" />
      {/* Text Section */}
      <div className="flex flex-col ml-5 text-left">
        <p className="text-lg underline underline-offset-3">Your Name</p>
        <p className="text-sm text-gray-600">Your Description</p>
      </div>
    </div>
  );
}
