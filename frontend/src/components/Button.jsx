function Button({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300"
    >
      {text}
    </button>
  );
}

export default Button;
