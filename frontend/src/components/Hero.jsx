import Button from "./Button";
import { useNavigate } from "react-router-dom";
function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-100 min-h-[90vh] flex items-center">

      <div className="absolute w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-20 -top-20 -left-20"></div>

      <div className="absolute w-96 h-96 bg-indigo-300 rounded-full blur-3xl opacity-20 bottom-0 right-0"></div>

      <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center px-8">

        <div>

          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-medium">
            AI Powered HR Platform
          </span>

          <h1 className="mt-6 text-6xl font-extrabold leading-tight">
            Smarter Employee
            <span className="text-blue-600"> Management</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Recruit, manage, analyze and grow your workforce using AI-powered automation.
          </p>

          <div className="mt-10 flex gap-5">
   <Button
  text="Get Started"
  onClick={() => navigate("/register")}
/>
           <button
  onClick={() =>
    document
      .getElementById("features")
      ?.scrollIntoView({
        behavior: "smooth",
      })
  }
  className="..."
>
  Learn More
</button>
          </div>

        </div>

        <div>

          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=900"
            alt="Hero"
            className="rounded-3xl shadow-2xl hover:scale-105 transition duration-500"
          />

        </div>

      </div>

    </section>
  );
}

export default Hero;