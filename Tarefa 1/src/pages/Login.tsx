import { ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../contexts/AppContext'
import { Card } from '../components/ui/Card'

export function Login() {
  const navigate = useNavigate()
  const { setActiveProfileId } = useAppContext()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // For demo purposes, we automatically assume Diretor de Curso on login
    // In a real app we'd fetch this from the Google Auth API payload
    setActiveProfileId('diretor') 
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen w-full flex bg-[#FCFCF7]">
      {/* Left Pane - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-between p-8 sm:p-12 lg:p-24">
        <div className="w-full flex justify-center lg:justify-start">
           <div className="flex items-center gap-2">
             <span className="text-[#C15B38] font-bold text-4xl tracking-tight leading-none">UMAIN</span>
             <span className="text-[#C15B38] font-semibold text-xl pt-2">WORKS</span>
           </div>
        </div>

        <div className="w-full max-w-sm flexflex-col items-center justify-center flex-1 mt-20">
          <Card className="w-full bg-white shadow-xl shadow-black/[0.03] border-umain-border/30 rounded-xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <h1 className="text-xl font-bold text-[#111827] mb-1">Bem-vindo de volta</h1>
             <p className="text-xs text-[#6B7280] mb-8 font-medium">Inicie sessão com a sua conta Google para continuar.</p>
             
             <button
               onClick={handleLogin}
               className="w-full flex items-center justify-center gap-2 bg-[#C15B38] hover:bg-[#a34b2f] text-white py-3 px-4 rounded transition-all active:scale-[0.98] shadow-sm font-semibold text-sm"
             >
               <ExternalLink className="w-4 h-4" />
               Entrar na sua conta
             </button>
          </Card>
        </div>

        <div className="w-full flex justify-center lg:justify-start text-[10px] text-[#6B7280] font-medium tracking-wide">
          Copyright © UMAIN WORKS 2026
        </div>
      </div>

      {/* Right Pane - Feature Image */}
      <div className="hidden lg:flex w-1/2 relative bg-[#111827] overflow-hidden">
         {/* Using an absolute embedded image or beautiful gradient fallback if missing */}
         <div className="absolute inset-0 bg-gradient-to-br from-[#111827] via-[#2F1F1A] to-[#C15B38] opacity-90 z-0"></div>
         <img 
           src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
           alt="Glass abstract" 
           className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 z-10"
         />
         
         <div className="relative z-20 flex flex-col justify-center h-full px-20">
            <h2 className="text-5xl font-bold text-white leading-tight drop-shadow-lg max-w-xl">
              Boost your business with real intelligence.
            </h2>
         </div>
      </div>
    </div>
  )
}
