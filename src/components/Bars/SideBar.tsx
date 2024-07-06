import React, { ReactNode, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';


function SideBarItem({ Icon, route }: { Icon: ReactNode, route: string }) {
  return (
    <div className="flex items-center justify-center w-full hover:bg-solid-primary-main rounded-lg p-2.5">
      <a className="flex items-center justify-center cursor-pointer" href={route}>
        {Icon}
      </a>
    </div>
  );
}


function SideBar() {
  return (
    <div className="flex justify-between bg-solid-primary-dark text-solid-primary-light min-w-[80px]">
      <div className='flex flex-col items-center mt-5 gap-5 w-full'>
        <SideBarItem Icon={<HomeIcon fontSize='large' />} route="Home" />
        <div className='mt-auto w-full'>
          <SideBarItem Icon={<SettingsIcon fontSize='large' />} route="Settings" />
        </div>
      </div>
    </div>
  );
}

export default SideBar;
