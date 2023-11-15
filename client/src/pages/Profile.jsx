import { useSelector } from "react-redux";
export const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full w-24 h-24 object-cover cursor-pointer self-center mt-2"
        />
        <input
          type="text"
          placeholder="username"
          name="username"
          className=" rounded-lg p-3  border"
        />
        <input
          type="text"
          placeholder="email"
          name="email"
          className=" rounded-lg p-3  border"
        />
        <input
          type="text"
          placeholder="password"
          name="password"
          className=" rounded-lg p-3  border"
        />
        <button className="bg-slate-700 text-white p-2 rounded-xl hover:opacity-95 disabled:opacity-60 uppercase">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="cursor-pointer text-red-600">Delete account</span>
        <span className="cursor-pointer text-blue-600">Sign out</span>
      </div>
    </div>
  );
};
