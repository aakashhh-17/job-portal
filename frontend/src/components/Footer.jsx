import { assets } from "../assets/assets"

const Footer = () => {
  return (
    <div className="flex justify-between container px-4 2xl:px-20 mx-auto mt-20 mb-4">
        <div className="flex gap-3 items-center ">
        <p className='text-3xl'><span className='font-bold'>Career</span>Bridge</p>
        <span className="text-gray-500 max-sm:hidden">|</span>
        <p className="max-sm:hidden text-gray-500 text-sm">Copyright @Aakash.codes | All right reserved.</p>
        </div>
        <div className="flex gap-2">
            <img className="h-10" src={assets.facebook_icon} alt="" />
            <img className="h-10" src={assets.twitter_icon} alt="" />
            <img className="h-10" src={assets.instagram_icon} alt="" />
        </div>
    </div>
  )
}

export default Footer