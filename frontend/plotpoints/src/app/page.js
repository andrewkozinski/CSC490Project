import Header from "./components/Header";
import Footer from "./components/Footer";
import './Homepage.css';

export default function Home() {
  return (
    <div>
      <Header/>
      <div className="flex grid grid-cols-3 items-center p-15">
        <div className="float:right">
          <h1 className="text-4xl inria-serif-regular whitespace-nowrap">Welcome to Plot Points!</h1>
          <p className="flex whitespace-nowrap">A unified review site for movies, tv shows and books</p>
        </div>
        <div className="flex grid float:right wrapper">
          <h1 className="font-bold pb-5">Trending Movies</h1>
            <div className="flex grid grid-cols-7 gap-10 justify-items-start pb-10">
              <img className="image" src="https://image.tmdb.org/t/p/w500/wPLysNDLffQLOVebZQCbXJEv6E6.jpg" alt="Superman 2025"/>
              <img className="image" src="https://image.tmdb.org/t/p/w500/cpf7vsRZ0MYRQcnLWteD5jK9ymT.jpg" alt="Weapons"/>
              <img className="image" src="https://image.tmdb.org/t/p/w500/wobVTa99eW0ht6c1rNNzLkazPtR.jpg" alt="The Long Walk"/>
              <img className="image" src="https://image.tmdb.org/t/p/w500/m1jFoahEbeQXtx4zArT2FKdbNIj.jpg" alt="One Battle After Another"/>
            </div>
          <h1 className="font-bold pb-5">Trending Shows</h1>
          <h1 className="font-bold pb-5">Trending Books</h1>

        </div>
      </div>
      <Footer/>
    </div>
  );
}
