import { Outlet } from '@remix-run/react'
import { useTheme } from 'remix-themes'
import { ModeToggleBtn } from '~/components/mode-toggle'

const Auth = () => {
  const [theme] = useTheme()
  return (
    <>
      <header className='stack-header backdrop-blur'>
        <div className="px-5 py-3 flex items-center justify-between h-full">
          <img style={{ width: "auto", height: "inherit" }} src={theme == "light" ? '/logo-light.png' : '/logo-dark.png'} alt='Logo' />
          <ModeToggleBtn />
        </div>
      </header>
      <main className='stack-main flex items-center justify-center w-full social-custom-scroll'>
        <Outlet />
      </main>
      <footer className='stack-footer backdrop-blur px-5 py-3'>
        <div className="flex items-center justify-end">
          <p>Made by Social App</p>
        </div>
      </footer>
    </>
  )
}

export default Auth