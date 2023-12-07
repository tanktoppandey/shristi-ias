import Image from "next/image";

export const Logo = () => {
  return (
    <div className='flex flex-row text-center justify-center items-center'>
            <Image 
        height={60}
        width={60}
        alt='logo'
        src='/image/logo.png'
        />
        <h2 className= " ml-2 font-bold ">सृष्टि IAS</h2>
    </div>
  )
}