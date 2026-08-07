import {
  UserGroupIcon,
  ChartBarIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";

function Features() {
  const features = [
    {
      title: "AI Recruitment",
      description:
        "Automatically shortlist resumes and recommend the best candidates using AI.",
      icon: CpuChipIcon,
    },
    {
      title: "Employee Management",
      description:
        "Manage employees, attendance, leave requests and departments from one dashboard.",
      icon: UserGroupIcon,
    },
    {
      title: "Analytics Dashboard",
      description:
        "Visualize employee performance, leave trends and company insights.",
      icon: ChartBarIcon,
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-50">

      <div className="max-w-7xl mx-auto px-8">

        <h2 className="text-5xl font-bold text-center text-slate-800">
          Powerful Features
        </h2>

        <p className="text-center text-gray-500 mt-5 max-w-2xl mx-auto">
          Everything HR teams need to automate repetitive work and improve
          productivity.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-20">

          {features.map((feature, index) => {

            const Icon = feature.icon;

            return (

              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-300"
              >

                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">

                  <Icon className="w-8 h-8 text-blue-600" />

                </div>

                <h3 className="text-2xl font-bold mt-6 text-slate-800">
                  {feature.title}
                </h3>

                <p className="mt-4 text-gray-500 leading-7">
                  {feature.description}
                </p>

              </div>

            );

          })}

        </div>

      </div>

    </section>
  );
}

export default Features;