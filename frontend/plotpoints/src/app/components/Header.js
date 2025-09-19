import "./Header.css";

export default function Header() {
  return (
    <header className="mx-auto flex max-w-sm items-end gap-20">
      {/* <img src="images/plotpointslogo.png" alt="Plot Points Text" width={100} height={100}/> */}
      <a className="inria-serif-regular text-4xl inline-block text-center" href="./">Plot Points</a>
      <a className="headingStyling" href="/movies">Movies</a>
      <a className="headingStyling whitespace-nowrap" href="/tvshows">TV Shows</a>
      <a className="headingStyling" href="/books">Books</a>
      
    </header>
  );
}