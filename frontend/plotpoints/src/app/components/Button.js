export default function Button({ children, onClick, type = "button" }) {
  return (
    <button
      type={type}
      className="font-[var(--font-inter)] bg-teal-100 text-black px-6 py-2 rounded-xl hover:bg-teal-200 shadow-lg"
    >
      {children}
    </button>
  );
}
