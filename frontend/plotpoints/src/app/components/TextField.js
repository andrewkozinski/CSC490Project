export default function TextField({ label, type = "text", name, placeholder, value, onChange, onKeyDown=() => { },}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-bold font-color text-gray-700 text-left">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        className="border blue shadow text-black p-4 border-transparent rounded-lg p-2"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
