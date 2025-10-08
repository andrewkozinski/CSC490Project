'use client';
import "./Header.css";
import Link from "next/link";

export default function Header() {
  return (
    /// Changed it so that its a flex box that contains the left side for the title and sections
    /// and right side for Sign-in/Sign-up and search bar
    <header className="mt-2 pb-3 flex justify-between items-center border-b">
      <nav className="flex mx-5 max-w-sm items-end gap-20">
        {/* <img src="images/plotpointslogo.png" alt="Plot Points Text" width={100} height={100}/> */}
        <Link className="inria-serif-regular text-3xl inline-block text-center" href="/">PLOT POINTS</Link>
        <Link className="text hoverCat" href="/movies">Movies</Link>
        <Link className="text hoverCat whitespace-nowrap" href="/tv">TV Shows</Link>
        <Link className="text hoverCat" href="/books">Books</Link>
      </nav>
      <nav className ="grid grid-rows-2 mr-5 justify-end">
        <div>
          <Link className="text fields brown shadow mr-10 mt-1" href="/signup">Sign Up</Link>
          <Link className="text fields blue shadow" href="/signin">Sign In</Link>
        </div>
        <div className="fields grid grid-cols-2 shadow search blue mt-2 items-center">
          <img className="h-4 w-4 -ml-2" src="/images/search.svg">
          </img>
          <input 
            className="-ml-30"
            placeholder="Search"
          />
        </div>
      </nav>
    </header>
  );
}