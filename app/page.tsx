const home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full relative overflow-hidden">
      {/* Background image for home page */}
      <img
        src="/globe.svg"
        alt="Global Expense Tracker Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none select-none z-0"
        aria-hidden="true"
      />
      <div className="bg-white/80 dark:bg-neutral-900/80 rounded-xl shadow-lg p-10 flex flex-col items-center max-w-xl w-full z-10 relative">
        <h1 className="text-4xl font-extrabold mb-4 text-center text-blue-700 dark:text-blue-300 drop-shadow">
          Welcome to Global Expense Tracker
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-200 mb-6 text-center">
          Effortlessly manage group expenses, track balances, and settle up with
          friends, family, or colleagues. Start by creating a group or exploring
          your existing groups.
        </p>
        <div className="flex gap-6 mt-4">
          <a
            href="/groups"
            className="px-6 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          >
            View Groups
          </a>
          <a
            href="/about"
            className="px-6 py-2 rounded bg-purple-500 text-white font-semibold shadow hover:bg-purple-600 transition"
          >
            About
          </a>
        </div>
      </div>
    </div>
  );
};
export default home;
