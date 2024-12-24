import { Link } from "react-router-dom"; 

export function Footer() {
  return (
    <footer className="bottom-0 m-3 rounded-lg bg-white shadow dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link
            to="/"
            className="mb-4 flex items-center space-x-3 sm:mb-0 rtl:space-x-reverse"
          >
            <img src="/owl.svg" className="h-8" alt="CodexME Logo" />
            <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
              CodexME
            </span>
          </Link>
          <ul className="mb-6 flex flex-wrap items-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:mb-0">
            <li>
              <a href="/" className="me-4 hover:underline md:me-6">
                Home
              </a>
            </li>
            <li>
              <a href="/playground" className="me-4 hover:underline md:me-6">
                Playground
              </a>
            </li>
            <li>
              <a href="/challenges" className="me-4 hover:underline md:me-6">
                Challenges
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
        <span className="block text-sm text-gray-500 dark:text-gray-400 sm:text-center">
          © 2023{" "}
          <a href="/" className="hover:underline">
            CodexME
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}