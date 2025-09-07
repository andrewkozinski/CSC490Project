import Link from "next/link";
function ThePage() {
  return (
    <div>
      <h1>The Page</h1>
      <p>This is the content of the page.</p>
      <p>Go to <Link href="/page1/page2">page2</Link></p>
    </div>
  );
}
export default ThePage;