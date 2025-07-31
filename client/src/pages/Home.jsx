
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import BottomBanner from '../components/BottomBanner'
//import NewsLetter from '../components/NewsLetter'


const Home = () => {
  return (
    <div className='mt-8'>
      <MainBanner></MainBanner>
      <Categories />
      <BestSeller />
      <BottomBanner />
     
     
    </div>
  )
}

export default Home