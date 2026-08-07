import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <Features />

      {/* About Section */}
      <section
        id="about"
        className="py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-8">

          <div className="text-center">

            <h2 className="text-4xl font-bold text-slate-800">
              About HRFlow AI
            </h2>

            <p className="mt-6 text-lg text-gray-600 max-w-4xl mx-auto leading-8">
              HRFlow AI is an intelligent Human Resource Management platform
              that simplifies employee management, HR policy handling, and
              AI-powered decision making. Our goal is to automate repetitive
              HR tasks, improve compliance, and provide instant policy answers
              using Artificial Intelligence.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">

            <div className="bg-slate-50 rounded-2xl p-8 shadow-sm">

              <h3 className="text-2xl font-semibold text-slate-800">
                🎯 Mission
              </h3>

              <p className="mt-4 text-gray-600">
                Automate HR operations and improve employee experience with AI.
              </p>

            </div>

            <div className="bg-slate-50 rounded-2xl p-8 shadow-sm">

              <h3 className="text-2xl font-semibold text-slate-800">
                🚀 Vision
              </h3>

              <p className="mt-4 text-gray-600">
                Build a smarter workplace where HR decisions are fast,
                transparent and AI-assisted.
              </p>

            </div>

            <div className="bg-slate-50 rounded-2xl p-8 shadow-sm">

              <h3 className="text-2xl font-semibold text-slate-800">
                💡 Technologies
              </h3>

              <p className="mt-4 text-gray-600">
                React • Node.js • Express • MongoDB • OpenAI API
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-24 bg-slate-100"
      >
        <div className="max-w-6xl mx-auto px-8">

          <div className="text-center">

            <h2 className="text-4xl font-bold text-slate-800">
              Contact Us
            </h2>

            <p className="mt-5 text-lg text-gray-600">
              Have questions or need support? We'd love to hear from you.
            </p>

          </div>

          <div className="grid md:grid-cols-2 gap-12 mt-16">

            <div>

              <h3 className="text-2xl font-semibold mb-6">
                Contact Information
              </h3>

              <p className="mb-4">
                📧 hrflowai@gmail.com
              </p>

              <p className="mb-4">
                📍 KIIT University, Bhubaneswar
              </p>

              <p>
                ☎ +91 98765 43210
              </p>

            </div>

            <form className="bg-white rounded-2xl shadow-md p-8 space-y-5">

              <input
                type="text"
                placeholder="Your Name"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                rows="5"
                placeholder="Your Message"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
              >
                Send Message
              </button>

            </form>

          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}