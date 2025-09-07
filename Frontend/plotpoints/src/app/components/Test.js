export default function Test({heading, subheading}) {
    return (
        <div>
            <h1 className="text-3xl font-bold underline">{heading}</h1>
            <p>{subheading}</p>
        </div>
    );
}