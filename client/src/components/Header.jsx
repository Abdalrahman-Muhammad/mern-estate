import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
export const Header = () => {
  return (
    <header className="bg-slate-200 shadow-md ">
      <div className="flex m-auto justify-between  items-center max-w-6xl p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Money</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form className="bg-slate-100 p-1 rounded flex items-center">
          <input
            id="search"
            type="text"
            placeholder="Search..."
            className="bg-transparent p-1 focus:outline-none w-24 sm:w-64"
          />
          <label htmlFor="search" className="cursor-pointer p-1">
            <FaSearch className="text-slate-600" />
          </label>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden text-slate-700 sm:inline hover:underline cursor-pointer">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden text-slate-700 sm:inline hover:underline cursor-pointer">
              About
            </li>
          </Link>
          <Link to="/sign-in">
            <li className=" text-slate-700 sm:inline hover:underline cursor-pointer ">
              Sign in
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
};
