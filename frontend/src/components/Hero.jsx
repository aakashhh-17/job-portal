import { MapPin, Search} from 'lucide-react'
import { assets } from '../assets/assets'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useRef } from 'react'

const Hero = () => {
  const {setSearchFilter, setIsSearched} = useContext(AppContext);

  const titleRef = useRef(null);
  const locationRef = useRef(null)

  const onSearch = ()=>{
    setSearchFilter({
      title: titleRef.current.value,
      location: locationRef.current.value
    });
    setIsSearched(true);
    
  }
 
  return (
    <div className='container 2xl:px-20 mx-auto my-10'>
        <div className='bg-gradient-to-r from-purple-800 to-purple-950 text-white py-16 text-center mx-2 rounded-xl '>
            <h2 className='font-medium mb-4 text-2xl md:text-3xl lg:text-4xl '>Over 10,000+ jobs to apply</h2>

            <p className='mb-8 max-w-xl mx-auto text-sm font-light px-5 '>Your Next Big Career Move Starts Right Here - Explore the Best Job Opportunities and Take the First Step Toward Your Future!</p>
            
            <div className='flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-white text-gray-500 max-w-xl mx-4 sm:mx-auto rounded overflow-hidden'>
              <div className='flex gap-2 items-center px-4 py-2 flex-1 min-w-0'>
                <Search className='size-4 sm:size-5 flex-shrink-0' />
                <input type="text" placeholder='Search for jobs' className='max-sm:text-xs rounded outline-none w-full min-w-0' ref={titleRef}/>
              </div>
              <div className='flex gap-2 items-center px-4 py-2 flex-1 min-w-0 border-t sm:border-t-0 sm:border-l border-gray-200'>
                <MapPin className='size-4 sm:size-5 flex-shrink-0'/>
                <input type="text" placeholder='Location' className='max-sm:text-xs rounded outline-none w-full min-w-0' ref={locationRef}/>
              </div>
              <button onClick={onSearch} className='bg-blue-600 text-white px-6 py-3 sm:py-2 m-0 sm:m-1 rounded-none sm:rounded cursor-pointer flex-shrink-0 font-medium'>Search</button>
            </div>
        </div>

        <div className='border border-gray-300 shadow-md mx-2 mt-5 p-6 rounded-md flex'>
          <div className='flex justify-center gap-10 lg:gap-16 flex-wrap'>
            <p className='font-medium'>Trusted by</p>
            <img className='h-6' src={assets.microsoft_logo} alt="" />
            <img className='h-6' src={assets.walmart_logo} alt="" />
            <img className='h-6' src={assets.accenture_logo} alt="" />
            <img className='h-6' src={assets.samsung_logo} alt="" />
            <img className='h-6' src={assets.amazon_logo} alt="" />
            <img className='h-6' src={assets.adobe_logo} alt="" />
          </div>
        </div>
    </div>
  )
}

export default Hero