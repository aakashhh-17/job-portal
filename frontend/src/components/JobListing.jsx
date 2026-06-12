import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import JobCard from "./JobCard";
import { Link } from "react-router-dom";

const JobListing = () => {
  const { isSearched, searchFilter, setSearchFilter, jobs, userData } =
    useContext(AppContext);

  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [bookmarked, setBookmarked] = useState(false);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      selectedCategories.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleLocationChange = (location) => {
    setSelectedLocations((prev) =>
      selectedLocations.includes(location)
        ? prev.filter((c) => c !== location)
        : [...prev, location]
    );
  };

  useEffect(() => {
    const matchesCategory = (job) =>
      selectedCategories.length === 0 ||
      selectedCategories.includes(job.category);

    const matchesLocation = (job) =>
      selectedLocations.length === 0 ||
      selectedLocations.includes(job.location);

    const matchesTitle = (job) =>
      searchFilter.title === "" ||
      job.title.toLowerCase().includes(searchFilter.title.toLowerCase());

    const matchesSearchLocation = (job) =>
      searchFilter.location === "" ||
      job.location.toLowerCase().includes(searchFilter.location.toLowerCase());


    const newFilteredJobs = jobs
      .slice()
      .reverse()
      .filter(
        (job) =>
          matchesCategory(job) &&
          matchesLocation(job) &&
          matchesSearchLocation(job) &&
          matchesTitle(job)
      );

    const allValidJobs = bookmarked ? newFilteredJobs.filter(job => userData.bookmarkedJobs.includes(job._id)) : newFilteredJobs;

    // setFilteredJobs(newFilteredJobs);
    setFilteredJobs(allValidJobs);
    setCurrentPage(1);
  }, [jobs, selectedCategories, selectedLocations, searchFilter, bookmarked, userData]);

  return (
    <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 bg-white px-4">
        {/* Search filter from hero component */}
        {isSearched &&
          (searchFilter.title !== "" || searchFilter.location !== "") && (
            <>
              <h3 className="font-medium text-lg mb-4">Current Search</h3>
              <div className="flex gap-2">
                {searchFilter.title && (
                  <span className="flex gap-1 text-md items-center bg-blue-50 border text-gray-700 border-blue-200 px-3 py-1.5 rounded">
                    {searchFilter.title}{" "}
                    <X
                      className="cursor-pointer size-4"
                      onClick={() =>
                        setSearchFilter((prev) => ({ ...prev, title: "" }))
                      }
                    />{" "}
                  </span>
                )}
                {searchFilter.location && (
                  <span className="flex gap-1 text-md items-center bg-red-50 border text-gray-700 border-red-200 px-3 py-1.5 rounded">
                    {searchFilter.location}{" "}
                    <X
                      className="cursor-pointer size-4"
                      onClick={() =>
                        setSearchFilter((prev) => ({ ...prev, location: "" }))
                      }
                    />
                  </span>
                )}
              </div>
            </>
          )}

        <button
          onClick={() => setShowFilter(!showFilter)}
          className="min-lg:hidden border border-gray-500 rounded px-6 py-1.5 cursor-pointer mt-4"
        >
          {showFilter ? "Close" : "Filters"}
        </button>

        <div className={showFilter ? "flex flex-row " : "max-lg:hidden"}>
          <input type="checkbox" name="bookmark" checked={bookmarked} onChange={() => setBookmarked(prev => !prev)} /> Bookmarked Jobs
        </div>

        {/* Category filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-4">Select by categories</h4>
          <ul className="space-y-4 text-gray-600">
            {JobCategories.map((category, index) => (
              <li className="flex gap-3 items-center" key={index}>
                <input
                  type="checkbox"
                  name="job"
                  onChange={() => handleCategoryChange(category)}
                  checked={selectedCategories.includes(category)}
                />{" "}
                {category}{" "}
              </li>
            ))}
          </ul>
        </div>

        {/* Location filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-4 mt-8">Select by Location</h4>
          <ul className="space-y-4 text-gray-600">
            {JobLocations.map((location, index) => (
              <li className="flex gap-3 items-center" key={index}>
                <input
                  type="checkbox"
                  name="location"
                  onChange={() => handleLocationChange(location)}
                  checked={selectedLocations.includes(location)}
                />{" "}
                {location}{" "}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Job listing */}
      <section className="w-full lg:w-3/4 text-gray-800 max-lg:px-4">
        <h3 className="font-medium text-3xl py-2" id="job-list">
          Latest jobs
        </h3>
        <p className="mb-8">Get your desired job from top companies</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredJobs
            .slice((currentPage - 1) * 6, currentPage * 6)
            .map((job, index) => (
              <JobCard key={index} job={job} />
            ))}
        </div>

        {/* Pagination */}
        {filteredJobs.length > 0 && (
          <div className="flex items-center justify-center space-x-2 mt-10">
            <a href="#job-list">
              {" "}
              <ArrowLeft
                onClick={() =>
                  currentPage !== 1 && setCurrentPage(currentPage - 1)
                }
              />{" "}
            </a>
            {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map(
              (_, index) => (
                <a key={index} href="#job-list">
                  <button
                    onClick={() => setCurrentPage(index + 1)}
                    className={`size-10 flex items-center justify-center border border-gray-300 rounded ${
                      currentPage === index + 1
                        ? "bg-blue-100 text-blue-500"
                        : "text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </button>
                </a>
              )
            )}
            <a href="#job-list">
              {" "}
              <ArrowRight
                onClick={() =>
                  currentPage !== Math.ceil(filteredJobs.length / 6) &&
                  setCurrentPage(currentPage + 1)
                }
              />{" "}
            </a>
          </div>
        )}
      </section>
    </div>
  );
};

export default JobListing;
