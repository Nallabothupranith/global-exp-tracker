export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="bg-white/80 dark:bg-neutral-900/80 rounded-xl shadow-lg p-10 flex flex-col items-center max-w-2xl w-full mt-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          About Global Expense Tracker
        </h1>
        <p className="mb-4 text-lg text-center">
          Global Expense Tracker is a modern, group-based expense management
          application built with Next.js and Supabase. It helps you easily
          manage shared expenses for trips, roommates, events, and more.
        </p>
        <ul className="list-disc pl-8 mb-6 text-base">
          <li>Create and manage multiple groups for different activities</li>
          <li>
            Add, edit, and remove group members with phone, email, and gender
            details
          </li>
          <li>
            Record expenses, specify who paid and who owes, and track all
            transactions
          </li>
          <li>
            Automatic calculation of balances and a "Settle Up" feature for
            transparency
          </li>
          <li>Simple, clean, and responsive user interface</li>
          <li>All data securely stored and managed with Supabase</li>
        </ul>
        <p className="mb-6 text-center">
          Perfect for friends, families, or colleagues who want to keep their
          shared expenses transparent and organized. Built with a focus on
          privacy, usability, and real-world group needs.
        </p>
        <div className="flex flex-col items-center gap-2 mb-4">
          <span className="font-semibold">Developer:</span>
          <span>N.Pranith kumar</span>
          <div className="flex gap-4 mt-2">
            <a
              href="https://www.linkedin.com/in/pranith kumar/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:underline"
            >
              LinkedIn
            </a>
            <a
              href="https://www.instagram.com/pranith_chowdhary/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:underline"
            >
              Instagram
            </a>
            <a
              href="mailto:pranithkumar2213@gmail.com"
              className="text-gray-700 hover:underline"
            >
              Email
            </a>
            <a
              href="https://github.com/Nallabothupranith"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:underline"
            >
              GitHub
            </a>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          <p>Version 1.0.0 &middot; Last updated: June 2025</p>
          <p>Made with ❤️ using Next.js, React, and Supabase</p>
        </div>
      </div>
    </div>
  );
}
