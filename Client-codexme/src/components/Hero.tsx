
export function Hero () {
    return (
        <>
  {/* Hello world */}
  <section className="bg-white dark:bg-gray-900 antialiased min-w-full">
    <div className="max-w-screen-xl px-4 py-8 mx-auto lg:px-6 sm:py-16 lg:py-24">
      <div className="flex flex-col gap-8 lg:items-center lg:gap-16 lg:flex-row">
        <div className="lg:max-w-xl xl:shrink-0">
          <div>
            <h2 className="text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Learn to code! Try new challenges and have fun!
            </h2>
            <p className="mt-5 text-base font-normal text-gray-500 dark:text-gray-400 md:max-w-3xl sm:text-xl">
            Get started by trying a programming language on the playground!
            </p>
          </div>
          <div className="flex flex-col gap-4 mt-8 sm:flex-row">
            <a
              href="#"
              title=""
              className="sm:w-[182px] px-5 py-3 w-full  text-base font-medium text-center text-white bg-primary-700 rounded-lg shrink-0 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              role="button"
            >
              Donate now
            </a>
            <a
              href="#"
              title=""
              className="sm:w-[182px] inline-flex w-full justify-center items-center px-5 py-3 text-base font-medium text-center text-gray-900 bg-white border border-gray-200 rounded-lg shrink-0 focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              role="button"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5 mr-2 -ml-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
             go to the playground
            </a>
          </div>
          <div className="mt-4 sm:border-t sm:border-gray-100 sm:mt-8 sm:pt-8 dark:border-gray-700">
            <p className="hidden text-base font-medium text-gray-500 sm:block">
              What you can practice here!
            </p>
            <div className="flex items-center mt-3 max-w-md">
              <img
                className="w-auto h-8 md:h-12 mr-4"
                src="python.svg"
                alt=""
              />
              <img
                className="w-auto h-8 md:h-12 mr-8"
                src="javascript.svg"
                alt=""
              />
              <img
                className="w-auto h-8 md:h-12 mr-8 dark:invert"
                src="go.svg"
                alt=""
              />
              <img
                className="w-auto h-8 md:h-12"
                src="java.svg"
                alt=""
              />
            </div>
          </div>
        </div>
        <div
          id="default-carousel"
          className="relative w-full"
          data-carousel="slide"
        >
          {/* Carousel wrapper */}
          <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
            {/* Item 1 */}
            <div
              className="hidden duration-700 ease-in-out rounded-lg"
              data-carousel-item=""
            >
              <img
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/ngo-carousel/image-1.jpg"
                className="absolute rounded-lg block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                alt=""
              />
            </div>
            {/* Item 2 */}
            <div
              className="hidden duration-700 ease-in-out rounded-lg"
              data-carousel-item=""
            >
              <img
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/ngo-carousel/image-2.jpg"
                className="absolute rounded-lg block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                alt=""
              />
            </div>
            {/* Item 3 */}
            <div
              className="hidden duration-700 ease-in-out rounded-lg"
              data-carousel-item=""
            >
              <img
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/ngo-carousel/image-3.jpg"
                className="absolute rounded-lg block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                alt=""
              />
            </div>
            {/* Item 4 */}
            <div
              className="hidden duration-700 ease-in-out rounded-lg"
              data-carousel-item=""
            >
              <img
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/ngo-carousel/image-4.jpg"
                className="absolute rounded-lg block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                alt=""
              />
            </div>
            {/* Item 5 */}
            <div
              className="hidden duration-700 ease-in-out rounded-lg"
              data-carousel-item=""
            >
              <img
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/ngo-carousel/image-5.jpg"
                className="absolute rounded-lg block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                alt=""
              />
            </div>
          </div>
          {/* Slider indicators */}
          <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
            <button
              type="button"
              className="w-3 h-3 rounded-full"
              aria-current="true"
              aria-label="Slide 1"
              data-carousel-slide-to={0}
            />
            <button
              type="button"
              className="w-3 h-3 rounded-full"
              aria-current="false"
              aria-label="Slide 2"
              data-carousel-slide-to={1}
            />
            <button
              type="button"
              className="w-3 h-3 rounded-full"
              aria-current="false"
              aria-label="Slide 3"
              data-carousel-slide-to={2}
            />
            <button
              type="button"
              className="w-3 h-3 rounded-full"
              aria-current="false"
              aria-label="Slide 4"
              data-carousel-slide-to={3}
            />
            <button
              type="button"
              className="w-3 h-3 rounded-full"
              aria-current="false"
              aria-label="Slide 5"
              data-carousel-slide-to={4}
            />
          </div>
          {/* Slider controls */}
          <button
            type="button"
            className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            data-carousel-prev=""
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="sr-only">Previous</span>
            </span>
          </button>
          <button
            type="button"
            className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            data-carousel-next=""
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="sr-only">Next</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>
</>

    )
}