export default function StatCard({

  title,

  value,

  icon,

  color,

}) {

  return (

    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 flex justify-between items-center">

      <div>

        <p className="text-gray-500 text-sm">

          {title}

        </p>

        <h2 className="text-3xl font-bold mt-2">

          {value}

        </h2>

      </div>

      <div
        className={`w-14 h-14 rounded-2xl ${color} flex justify-center items-center text-white`}
      >

        {icon}

      </div>

    </div>

  );

}