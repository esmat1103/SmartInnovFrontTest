import React from 'react';
import Image from 'next/image';
import admins from "@/public/main_content/adminsStat.svg";
import municipality from "@/public/main_content/munici.svg";
import bins from "@/public/main_content/binsStat.svg";


const Stats = () => {
  return (
    <div className='mx-3 mt-3'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-6 col-md-12 col-sm-12'>
            <div className='stats-box'>
            <p className='dark ml-3 pt-1  poppins fw600'>  Statistics Summary</p>

              <div className='container'>

                <div className='row space-x-4'>

                  <div className='col-2 mt-4 flex relative'>
                    <div className='statcarré bg-pink relative'>
                      <div className='small-circle mt-3 ml-2 bg-stat-circle-pink absolute top-0 left-1 flex items-center justify-center'>
                          <Image src={admins} alt='admins' width={20} height={20}/>
                        </div> 
                    </div> 
                  </div>
                  <div className='col-2 mt-4 flex relative'>
                    <div className='statcarré bg-yellow relative'>
                      <div className='small-circle mt-3 ml-2 bg-stat-circle-yellow  absolute top-0 left-1 flex items-center justify-center'>
                           <Image src={municipality} alt='municipality' className='mb-2' width={20} height={20}/>
                      </div> 
                    </div>
                  </div>
                  <div className='col-2 mt-4 flex relative'>
                    <div className='statcarré bg-green relative'>
                      <div className='small-circle  mt-3 ml-3 bg-stat-circle-green absolute top-0 left-1 flex items-center justify-center'>
                          <Image src={bins} alt='bins' className='' width={15} height={15}/>
                      </div> 
                    </div> 
                  </div>
                  <div className='col-2 mt-4 flex relative'>
                    <div className='statcarré bg-blue relative'>
                      <div className='small-circle mt-3 ml-2 bg-stat-circle-lila absolute top-0 left-1 flex items-center justify-center'>
                          <Image src={admins} alt='admins' width={20} height={20}/>

                        </div> {/* Added top-1 and left-1 for small margin */}
                    </div> 
                  </div>
                  <div className='col-2 mt-4 flex relative'>
                    <div className='statcarré bg-lila relative'>
                      <div className='small-circle mt-3 ml-2  bg-stat-circle-blue absolute top-0 left-1 flex items-center justify-center'>
                          <Image src={admins} alt='admins' width={20} height={20}/>
                      </div> {/* Added top-1 and left-1 for small margin */}
                    </div> 
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Another div with 4 columns */}
          <div className='col-lg-6'>
            <div className='stats-box'>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
