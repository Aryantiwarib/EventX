import React from 'react'
// import LogoPath from "../../Images/LOGO_1EX-PNG[1].png"
import LogoPath from "../../Images/harshit.jpg"
function Logo({width='100px'}) {
  return (

    <div>
    <svg xmlns="http://www.w3.org/2000/svg" role="img"   aria-hidden="true"  width="130" height="40" className='mt-2' viewBox="0 0 256 228">
        <image href={LogoPath} x="0" y="0"  preserveAspectRatio="xMidYMid meet" viewBox="0 0 400 400"/>
    </svg>
</div>

  )
}

export default Logo