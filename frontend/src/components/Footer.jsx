import {
  EnvelopeIcon,
  GlobeAltIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">

      <div className="max-w-7xl mx-auto px-8">

        <div className="grid md:grid-cols-2 gap-10">

          <div>

            <h2 className="text-3xl font-bold">
              HRFlow AI
            </h2>

            <p className="text-gray-400 mt-4 leading-7 max-w-md">
              AI-powered HR platform that simplifies employee management,
              leave approvals and analytics through intelligent automation.
            </p>

          </div>

          <div className="flex md:justify-end items-center gap-6">

            <div className="w-12 h-12 rounded-full bg-slate-800 flex justify-center items-center hover:bg-blue-600 transition cursor-pointer">
              <EnvelopeIcon className="w-6 h-6" />
            </div>

            <div className="w-12 h-12 rounded-full bg-slate-800 flex justify-center items-center hover:bg-blue-600 transition cursor-pointer">
              <GlobeAltIcon className="w-6 h-6" />
            </div>

            <div className="w-12 h-12 rounded-full bg-slate-800 flex justify-center items-center hover:bg-blue-600 transition cursor-pointer">
              <CodeBracketIcon className="w-6 h-6" />
            </div>

          </div>

        </div>

        <hr className="border-slate-700 my-10" />

        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400">

          <p>
            © 2026 HRFlow AI. All Rights Reserved.
          </p>

          <p className="mt-3 md:mt-0">
            Built with React • Tailwind CSS • Node.js
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;