'use client';
import "./Header.css";


export default function Header() {
  return (
    /// Changed it so that its a flex box that contains the left side for the title and sections
    /// and right side for Sign-in/Sign-up and search bar
    <header className="w-full flex justify-between items-center">
      <div className="mx-5 flex max-w-sm items-end gap-30">
        {/* <img src="images/plotpointslogo.png" alt="Plot Points Text" width={100} height={100}/> */}
        <a className="inria-serif-regular text-4xl inline-block text-center" href="./">PLOT POINTS</a>
        <a className="headingStyling" href="/movies">Movies</a>
        <a className="headingStyling whitespace-nowrap" href="/tv">TV Shows</a>
        <a className="headingStyling" href="/books">Books</a>
      </div>
      <nav className ="grid gap-10 mx-5 grid-rows-2">
        <div>
          <a className="headingStyling" href="/signup">Sign Up</a>
          <a className="headingStyling" href="/signin">Sign In</a>
        </div>
        
        <div className="app">
          <input
           className="search headingStyling flex-wrap"
           placeholder="Search..."
           onChange={(e) => setQuery(e.target.value.toLowerCase())}
          />
       {/* <ul className="list">
         {Users.filter((asd) =>
           asd.first_name.toLowerCase().includes(query)
         ).map((user) => (
           <li className="listItem" key={user.id}>
             {user.first_name}
           </li>
         ))}
       </ul> */}
     </div>
      </nav>
    </header>
  );
}