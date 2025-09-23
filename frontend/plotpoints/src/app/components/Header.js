'use client';
import "./Header.css";

export default function Header() {
  return (
    /// Changed it so that its a flex box that contains the left side for the title and sections
    /// and right side for Sign-in/Sign-up and search bar
    <header className="w-full mt-2 pb-3 flex justify-between items-center border-b-2">
      <div className="flex mx-5 max-w-sm items-end gap-20">
        {/* <img src="images/plotpointslogo.png" alt="Plot Points Text" width={100} height={100}/> */}
        <a className="inria-serif-regular text-4xl inline-block text-center" href="./">PLOT POINTS</a>
        <a className="text" href="/movies">Movies</a>
        <a className="text whitespace-nowrap" href="/tv">TV Shows</a>
        <a className="text" href="/books">Books</a>
      </div>
      <nav className ="grid grid-rows-2 mr-5">
        <div>
          <a className="text fields brown shadow mr-10 mt-1" href="/signup">Sign Up</a>
          <a className="text fields blue shadow" href="/signin">Sign In</a>
        </div>
        <div>
          <input 
            className="text fields shadow search blue mt-2 mr-5"
            placeholder="Search"
          />
        </div>
      </nav>
    </header>
  );
}