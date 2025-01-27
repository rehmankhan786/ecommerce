import React from 'react'
import { Link } from 'react-router-dom'

const Notfound = () => {
  return (
    <div className='h-[100vh] flex justify-center items-center '> 
    
    <h2 className='text-center text-4xl '>Error: 404 <br/> Page Not Found <br/> Go to<Link className='text-blue-500' to={"/"} > Homepage</Link></h2>
    
    </div>
  )
}

export default Notfound