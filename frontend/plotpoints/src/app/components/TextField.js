export default function TextField({ label, type = "text", name, placeholder, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 text-center">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        className="border blue text-black p-4 border-gray-300 rounded-lg p-2 text-center"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
