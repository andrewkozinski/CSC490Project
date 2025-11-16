"use client";
import React, {useState, useContext, createContext } from 'react';
import "./Filter.css";

const FilterContext = createContext();

export default function Filter() {
    
    const [filters, setFilters] = useState({
        type: '',
        genre: '',
        year: '',
    });
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

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
                    {filteredCourses.map((course) => (
                        <li key={course.id}>
                            {course.title} - {course.category}
                            ({course.level}) - {course.price}
                        </li>
                    ))}
                </ul>
            </div>
        </FilterContext.Provider>
    );
};
const FilterControls = () => {
    const { filters, handleFilterChange } = useContext(FilterContext);
    return (
        <div className="filter-container">
            <select className="select-filter"
                name="type"
                value={filters.category}
                onChange={handleFilterChange}>
                <option value="">Media Type</option>
                <option value="Movies">Movies</option>
                <option value="Shows">TV Shows</option>
                <option value="Books">Books</option>
            </select>
            <select 
                className="select-filter"
                name="genre" 
                value={filters.level}
                onChange={handleFilterChange}>
                <option value="">Genre</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
            </select>
            <select 
                className="select-filter"
                name="year" 
                value={filters.price}
                onChange={handleFilterChange}>
                <option value="">Release Year</option>
                <option value="₹1000">₹1000</option>
                <option value="₹1200">₹1200</option>
                <option value="₹1500">₹1500</option>
                <option value="₹1800">₹1800</option>
                <option value="₹2000">₹2000</option>
                <option value="₹2200">₹2200</option>
                <option value="₹2500">₹2500</option>
            </select>
        </div>
    );
};