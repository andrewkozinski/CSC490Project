import "../globals.css"
export default function GenreContainer({ label, children }) {
  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4">{label}</h2>
      <div className="flex gap-5 overflow-x-auto px-7 py-7">
        {children}
      </div>
    </section>
  );
}
