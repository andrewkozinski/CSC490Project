'use client';
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import "./Header.css";
import "./Profile.css";
import Link from "next/link";
import {useRouter} from 'next/navigation';
import { getNotifications, getNotifCount, readNotification } from "@/lib/notifications";
import Image from "next/image";

export default function Header() {
  const [showNotifications] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const [notificationsList, setNotificationsList] = useState([]);


  useEffect(() => {
    // Fetch notifications for the user
    const fetchNotifications = async () => {
      try {
        const notifications = await getNotifications(session?.user?.id);
        setNotificationsList(notifications);
        console.log("Fetched notifications:", notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (session) {
      fetchNotifications();
    }
  }, [session]);

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

      { !session ? 
      // User is not logged in
      (
        <nav className ="grid grid-rows-2 mr-5 justify-end">
          <div>
          <Link className="text fields blue btn-shadow mr-10 mt-1" href="/signup">Sign Up</Link>
          <Link className="text fields blue btn-shadow -ml-5" href="/signin">Sign In</Link>
          </div>
          <div className="fields grid grid-cols-2 shadow search blue mt-2 items-center">
            <img className="h-4 w-4 -ml-2" src="/images/search.svg">
            </img>
            <input 
            className="-ml-30"
            placeholder="Search"
            onKeyDown={e => {
              if (e.key === 'Enter' && e.target.value.trim() !== '') {
                router.push(`/search/${encodeURIComponent(e.target.value.trim())}`);
              }
            }}
            />
          </div>
        </nav>    
      )
      :
      // User is logged in
      (
      <nav className ="flex grid grid-rows-2">
        <div className="flex justify-end items-center mr-2 -m-3">
          <div className="notification">
            {/*Notification bell */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>

            <div className="notification-content -ml-79 mt-3">
              {/* Notification list perhaps */}
              <h1 className="text-lg font-bold p-4">Notifications</h1>
              {/* <Link className ="hover:rounded-tr-sm hover:rounded-tl-sm" href={`/profile/${session?.user?.id}`}>SOMEONE has commented on your post.</Link>
              <Link className ="hover:rounded-tr-sm hover:rounded-tl-sm" href={`/profile/${session?.user?.id}`}>SOMEONE has followed you.</Link> */}

              {notificationsList.length === 0 ? (
                <p className="p-4 text-sm">No new notifications</p>
              ) : (
                
                notificationsList.map((notification, index) => (
                  
                  <Link 
                    key={index}
                    className=""
                    href={notification.link}
                    onClick={async () => {
                      try {
                        await readNotification(notification.noti_id, session?.accessToken);
                      } catch (error) {
                        console.error("Error marking notification as read:", error);
                      }
                    }}
                  >
                    {/* <Image src={notification.img} alt="Notification" className="icon" width={100} height={100} /> */}
                    {/* {notification.is_read == 1 ? (
                      <p>{notification.notif_message}</p>

                    ) : (
                      <div className="flex flex-row gap-5">
                          <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="0" cy="0" r="10" fill="red"/>
                          </svg>
                          <p>{notification.notif_message}</p>

                      </div>
                      
                    )} */}
                    <p>{notification.notif_message}</p>
                    <p className="font-bold">{notification.is_read == 1 ? "Read" : "Unread"}</p> {/*Read == 1, unread == 0 */}
                  </Link>
                  
                ))
              )}


            </div>
          </div>
           
          <div className="dropdown">
            {/*Profile pic svg */ }
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 m-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <div className="dropdown-content -ml-24">
              <h1 className="text-lg font-bold p-4">My Account</h1>
              <Link className ="" href={`/profile/${session?.user?.id}`}>My Profile</Link>
              <Link href="/settings">Settings</Link>
              <Link className ="hover:rounded-br-sm hover:rounded-bl-sm" href="/" onClick={() => signOut()} >Sign Out</Link>
            </div>
          </div>

        </div>
        <div className="fields grid grid-cols-2 shadow search blue mt-2 mr-5 items-center">
          <img className="h-4 w-4 -ml-2" src="/images/search.svg">
          </img>
          <input 
            className="-ml-30"
            placeholder="Search"
            onKeyDown={e => {
              if (e.key === 'Enter' && e.target.value.trim() !== '') {
                router.push(`/search/${encodeURIComponent(e.target.value.trim())}`);
              }
            }}
          />
        </div>
      </nav>  
      ) 
      }
      
    </header>
  );
}