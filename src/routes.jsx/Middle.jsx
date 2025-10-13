import React from 'react'
import LandingSlider from "../components/LandingSlider";
import LandingAbout from "../components/LandingAbout";
const Middle = () => {
  return (
    <div>
       <LandingSlider />
            <div className="my-6">
              <LandingAbout />
            </div>
    </div>
  )
}

export default Middle
