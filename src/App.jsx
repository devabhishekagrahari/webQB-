
import './App.css'
import ForgetPassword from './screens/Authentications/forgetPassword'
import LoginPage from './screens/Authentications/login'
import SignUp from './screens/Authentications/signUp'
import { BrowserRouter, Routes , Route } from 'react-router-dom'
import HomeScreen from './screens/Dashboard/homescreen'
import BaseLayout from './components/baseLayout'
import GeneratePaper from './screens/Paper/generatePaper'
import { QuestionProvider } from './context/questionContext'

function App() {
  return ( 
  <QuestionProvider>
  <div className="min-h-screen flex flex-row max-width-full bg-white dark:bg-teal-950 ">

    <BrowserRouter>
   
      <Routes>
        <Route path='/' element={<BaseLayout><GeneratePaper/></BaseLayout>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/forget-password' element={<ForgetPassword/>}/>

        <Route path='/dashboard' element={<BaseLayout><HomeScreen/></BaseLayout>}/>

        <Route path='/add-question' element={<BaseLayout><HomeScreen/></BaseLayout>}/>
        <Route path='/view-question' element={<BaseLayout><HomeScreen/></BaseLayout>}/>
        <Route path='/generate-paper' element={<BaseLayout><GeneratePaper/></BaseLayout>}/>
        <Route path='/view-paper' element={<BaseLayout><HomeScreen/></BaseLayout>}/>
      </Routes>
      
    </BrowserRouter>
  </div>  
  </QuestionProvider>
  )
}

export default App
