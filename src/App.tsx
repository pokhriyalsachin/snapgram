import { Routes , Route } from 'react-router-dom'
import './globals.css'
import SigninForm from './_auth/forms/SigninForm'
import SignupForm from './_auth/forms/SignupForm'
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'
import { AllUsers, CreatePost, EditPost, Explore, Home, PostDetails, Profile, Saved, UpdateProfile } from './_root/pages'
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <main  className="flex h-screen">
      <Routes>
        <Route element={<AuthLayout/>}>
        <Route path="/sign-in" element={<SigninForm></SigninForm>}></Route>
        <Route path="/sign-up" element={<SignupForm></SignupForm>}></Route>
      </Route>

      <Route element={<RootLayout></RootLayout>}>

        <Route index element={<Home></Home>}></Route>
        <Route path="/explore" element={<Explore></Explore>}></Route>
        <Route path="/saved" element={<Saved></Saved>}></Route>
        <Route path="/all-users" element={<AllUsers></AllUsers>}></Route>
        <Route path="/create-post" element={<CreatePost></CreatePost>}></Route>
        <Route path="/update-post/:id" element={<EditPost></EditPost>}></Route>
        <Route path="/posts/:id" element={<PostDetails></PostDetails>}></Route>
        <Route path="/profile/:id/*" element={<Profile></Profile>}></Route>
        <Route path="/update-profile/:id" element={<UpdateProfile></UpdateProfile>}></Route>
      </Route>
      </Routes>
      
      <Toaster/>
    </main>
    
  )
}

export default App
