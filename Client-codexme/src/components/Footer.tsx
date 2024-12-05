export function Footer() {
    return ( <footer className="bg-white rounded-lg shadow dark:bg-gray-900 m-3 bottom-0">
    <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <a
          href="https://flowbite.com/"
          className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
        >
          <img
            src="owl.svg"
            className="h-8"
            alt="CodexME Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            CodexME
          </span>
        </a>
        <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
          <li>
            <a href="/" className="hover:underline me-4 md:me-6">
              Home
            </a>
          </li>
          <li>
            <a href="/playground" className="hover:underline me-4 md:me-6">
              Playground
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline me-4 md:me-6">
              Challenges
            </a>
          </li>
        </ul>
      </div>
      <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
        © 2023{" "}
        <a href="https://flowbite.com/" className="hover:underline">
          CodexME
        </a>
        . All Rights Reserved.
      </span>
    </div>
  </footer>
    )
}

