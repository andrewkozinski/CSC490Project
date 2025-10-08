import "../globals.css"
export default function GenreContainer({ label, children }) {
    //Will scroll if more media is added
  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold pl-10">{label}</h2>
      <div className="flex gap-5 overflow-x-auto px-10 py-5 h-70 items-center">
        {children}
      </div>
    </section>
  );
}
