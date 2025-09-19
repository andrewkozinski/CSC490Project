import "./Header.css";

export default function Header() {
  return (
    <header className="mx-auto flex max-w-sm items-center gap-10 object-fill">
      <img src="/resources/plotpointslogo.png" alt="Plot Points Text" />
      <h2 className="text-xl inline-block">Movies</h2>
      <h2 className="text-xl inline-block">TV Shows</h2>
      <h2 className="text-xl inline-block">Books</h2>
      
    </header>
  );
}