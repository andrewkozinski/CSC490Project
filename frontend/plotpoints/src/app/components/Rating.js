import Star from "./Star";

export default function Rating() {
  return (
    //reverse in order to make stars fill up properly
    <div className="flex flex-row-reverse justify-center p-4">
      {[...Array(5)].map((_, i) => (
        <a
          key={i}
          className="cursor-pointer peer peer-hover:fill-yellow-500 hover:fill-yellow-400 fill-transparent stroke-neutral-950"
        >
          <Star className="w-8 h-8" />
        </a>
      ))}
    </div>
  );
}
