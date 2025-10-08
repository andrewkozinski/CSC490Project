'use client';
import "./Header.css";
import Link from "next/link";

export default function Header() {
  return (
    /// Changed it so that its a flex box that contains the left side for the title and sections
    /// and right side for Sign-in/Sign-up and search bar
    <header className="mt-2 pb-3 flex justify-between items-center border-b">
      <nav className="flex mx-5 max-w-sm items-end gap-20">
        <Link className="inria-serif-regular text-3xl inline-block text-center" href="/">PLOT POINTS</Link>
        <Link className="text hoverCat" href="/movies">Movies</Link>
        <Link className="text hoverCat whitespace-nowrap" href="/tv">TV Shows</Link>
        <Link className="text hoverCat" href="/books">Books</Link>
      </nav>
      <nav className ="flex grid grid-rows-2">
        <div className="flex justify-end items-center mr-2 -m-3">
          <img 
            src="/images/notifbell.png"
            className="icon"
          > 
          </img>
          <img 
            src="/images/profileicon.png"
            className="icon"
          > 
          </img>
        </div>
        <div className="">
          <input 
            className="text fields shadow search blue mt-2 mr-5"
            placeholder="Search"
          />
        </div>
      </nav>
    </header>
  );
}