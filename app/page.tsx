import Image from "next/image";
import { text } from "stream/consumers";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <main className="flex-grow">
        <section className="bg-green-100 dark:bg-background-dark py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4" style={{textDecoration: "underline", textDecorationColor: "#238636"}}>
              Simplifying Teacher Coverage
            </h2>
            <p className="text-lg text-gray-700 dark:text-white mb-8">
              Automating the scheduling process to save administrators time and
              ensure every class is covered seamlessly.
            </p>
            <a
              href="#get-started"
              className="bg-primary-light dark:bg-primary-dark text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700"
            >
              Get Started
            </a>
          </div>
        </section>

        <section id="features" className="py-16 dark:bg-secondary-dark">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl dark:text-white font-bold text-center text-gray-800 mb-8">
              Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-gray-100 dark:bg-tertiary-dark rounded-lg shadow">
                <h4 className="text-xl dark:text-white font-semibold mb-2">
                  Automated Scheduling
                </h4>
                <p className="text-gray-600 dark:text-white">
                  Quickly generate coverage plans based on teacher availability.
                </p>
              </div>
              <div className="p-6 bg-gray-100 dark:bg-tertiary-dark rounded-lg shadow">
                <h4 className="text-xl dark:text-white font-semibold mb-2">
                  Real-Time Updates
                </h4>
                <p className="text-gray-600 dark:text-white">
                  Adjust schedules instantly to handle unexpected absences.
                </p>
              </div>
              <div className="p-6 bg-gray-100 dark:bg-tertiary-dark rounded-lg shadow">
                <h4 className="text-xl dark:text-white font-semibold mb-2">
                  Coverage Insights
                </h4>
                <p className="text-gray-600 dark:text-white">
                  Identify gaps and unresolved coverage areas at a glance.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-16 bg-green-100 dark:bg-background-dark">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">About Us</h3>
            <p className="text-gray-700 dark:text-white">
              Our team is dedicated to helping schools overcome the substitute
              teacher shortage by simplifying the coverage process through
              intuitive, efficient software solutions.
            </p>
          </div>
        </section>

        <section id="contact" className="py-16 dark:bg-secondary-dark">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl dark:text-white font-bold text-gray-800 mb-4">
              Contact Us
            </h3>
            <p className="text-gray-700 dark:text-white mb-8">
              Have questions or want to learn more? Reach out to us today.
            </p>
            <a
              href="#contact-form"
              className="bg-primary-light dark:bg-primary-dark text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700"
            >
              Get in Touch
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
