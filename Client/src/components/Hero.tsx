import { Button, Carousel } from "flowbite-react"


export function Hero () {
    return (
        <>
  {/* Hello world */}
  <section className="bg-white dark:bg-gray-900 antialiased min-w-full">
    <div className="max-w-screen-xl px-4 py-8 mx-auto lg:px-6 sm:py-16 lg:py-24">
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2">
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
            {/* <a href="/playground"><Button>Donate now</Button></a> */}
            <a href="/playground"><Button color='blue'>Go to the Playground</Button></a>
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

        <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
          <Carousel>
            <img src="coding1.jpg" alt="..." />
            <img src="coding2.jpg" alt="woman in a laptop using a hooding" />
            <img src="coding3.jpg" alt="two woman holding a laptop" />
            <img src="coding4.jpg" alt="Man In Grey Sweater Holding Yellow Sticky Note" />
            <img src="coding5.jpg" alt="Man in White Shirt Using Macbook Pro" />
          </Carousel>
        </div>
      </div>
    </div>
  </section>
  </>

    )
}