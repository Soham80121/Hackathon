export default function ChatMessage({
  sender,
  message,
}) {

  const isUser = sender === "user";

  return (

    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-5`}
    >

      <div
        className={`max-w-xl px-6 py-4 rounded-2xl shadow-md ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-white dark:bg-slate-900"
        }`}
      >

        <p className="font-semibold mb-2">

          {isUser ? "You" : "Kyuka AI"}

        </p>

        <p>{message}</p>

      </div>

    </div>

  );

}
