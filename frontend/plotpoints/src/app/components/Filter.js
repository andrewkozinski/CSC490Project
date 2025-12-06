"use client";
import React, {useState, useContext, createContext } from 'react';
import "./Filter.css";
import { useSettings } from "../context/SettingsProvider";

const FilterContext = createContext();

export default function Filter( {filters, handleFilterChange} ) {

    

    const media = [
        
    ];

    const filteredCourses = media.filter((media) => {
        return (
            (filters.type === '' ||
                media.type === filters.type) &&
            (filters.genre== '' ||
                media.genre === filters.genre) &&
            (filters.year === '' ||
                media.year === filters.year)
        );
    });
    return (
        <FilterContext.Provider value={{
            filters, handleFilterChange
        }}>
            <div style={{ padding: '20px' }}>
            
                <FilterControls />
                <ul>
                    {/* list of media */}
                </ul>
            </div>
        </FilterContext.Provider>
    );
};
const FilterControls = () => {
    const { filters, handleFilterChange } = useContext(FilterContext);
    const { darkMode: darkOn} = useSettings();

    return (
        <div className="filter-container">
            <select className={`select-filter ${darkOn ? "text-[#282828]" : ""}`}
                name="type"
                value={filters.type}
                onChange={handleFilterChange}>
                <option value="">Media Type</option>
                <option value="All">All</option>
                <option value="Movies">Movies</option>
                <option value="Shows">TV Shows</option>
                <option value="Books">Books</option>
            </select>
            <select 
                className={`select-filter ${darkOn ? "text-[#282828]" : ""}`}
                name="genre" 
                value={filters.genre}
                onChange={handleFilterChange}>
                <option value="">Genre</option>
                <option value="Action">Action</option>
                <option value="Adventure">Adventure</option>
                <option value="Action & Adventure">Action & Adventure</option>
                <option value="Animation">Animation</option>
                <option value="Comedy">Comedy</option>
                <option value="Crime">Crime</option>
                <option value="Documentary">Documentary</option>
                <option value="Drama">Drama</option>
                <option value="Family">Family</option>
                <option value="Fantasy">Fantasy</option>
                <option value="History">History</option>
                <option value="Horror">Horror</option>
                <option value="Kids">Kids</option>
                <option value="Mystery">Mystery</option>
                <option value="Romance">Romance</option>
                <option value="News">News</option>
                <option value="Reality">Reality</option>
                <option value="Sci-Fi & Fantasy">Sci-Fi & Fantasy</option>
                <option value="Thriller">Thriller</option>
                
            </select>
            {/* <select 
                className="select-filter"
                name="year" 
                value={filters.year}
                onChange={handleFilterChange}>
                <option value="">Release Year</option>
    
            </select> */}
        </div>
    );
};