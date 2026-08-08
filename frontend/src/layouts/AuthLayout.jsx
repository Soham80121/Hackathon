import {
  SparklesIcon,
  ChatBubbleBottomCenterTextIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";

import { motion } from "framer-motion";

function FeatureCard({ icon, title, text }) {
  return (
    <div className="flex items-center gap-4 bg-white/10 dark:bg-slate-900/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/20 dark:bg-slate-900/15 transition-all duration-300">
      <div className="flex-shrink-0">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-blue-100 mt-1">
          {text}
        </p>
      </div>
    </div>
  );
}

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">

      {/* LEFT PANEL */}

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900">

        {/* Glow Effects */}

        <div className="absolute -top-32 -left-24 w-80 h-80 bg-blue-400 rounded-full blur-3xl opacity-20"></div>

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>

        <div className="relative z-10 flex flex-col justify-between h-full px-14 py-16 text-white">

          {/* Logo */}

          <div>

            <div className="flex items-center gap-4">

              <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center p-2 shadow-xl shrink-0 border border-white/20">
                <img src="/logo.png" alt="Kyuka AI Logo" className="w-full h-full object-contain drop-shadow-sm" />
              </div>

              <h1 className="text-4xl font-bold">
                Kyuka AI
              </h1>

            </div>

            <h2 className="mt-12 text-5xl font-bold leading-tight">

              AI Powered
              <br />

              HR Management
              <br />

              Platform

            </h2>

            <p className="mt-8 text-lg leading-8 text-blue-100 max-w-lg">

              Simplify employee leave tracking, manage
              your workforce efficiently, and get instant
              HR policy answers with Artificial Intelligence.

            </p>

          </div>

          {/* Features */}

          <div className="space-y-4">

            <FeatureCard
              icon={<ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-cyan-300"/>}
              title="AI Policy Assistant"
              text="Get instant answers to complex HR policies."
            />

            <FeatureCard
              icon={<CalendarDaysIcon className="w-8 h-8 text-green-300"/>}
              title="Leave Management"
              text="Easily track, approve, or reject leave requests."
            />

            <FeatureCard
              icon={<UserGroupIcon className="w-8 h-8 text-yellow-300"/>}
              title="Employee Directory"
              text="Manage roles and assign departments."
            />

            <FeatureCard
              icon={<ShieldCheckIcon className="w-8 h-8 text-pink-300"/>}
              title="Secure Authentication"
              text="Protected using JWT authentication."
            />

          </div>

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div className="flex-1 flex justify-center items-center p-8">

        <motion.div

          initial={{
            opacity:0,
            y:30,
            scale:0.95
          }}

          animate={{
            opacity:1,
            y:0,
            scale:1
          }}

          transition={{
            duration:0.45
          }}

          className="w-full max-w-xl"

        >

          <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl p-12">

            <div className="text-center">

              <div className="w-20 h-20 bg-slate-950 rounded-2xl flex items-center justify-center p-2 mx-auto shadow-2xl border border-gray-200 dark:border-slate-700/50">
                <img src="/logo.png" alt="Kyuka AI Logo" className="w-full h-full object-contain drop-shadow-sm" />
              </div>

              <h2 className="mt-6 text-4xl font-bold text-slate-800 dark:text-darktext-primary">
                {title}
              </h2>

              <p className="mt-3 text-gray-500 dark:text-darktext-muted text-lg">
                {subtitle}
              </p>

            </div>

            <div className="mt-10">

              {children}

            </div>

          </div>

        </motion.div>

      </div>

    </div>
  );
}

export default AuthLayout;
