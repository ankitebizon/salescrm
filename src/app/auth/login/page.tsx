import { Metadata } from 'next'
import LoginForm from '@/components/auth/login-form'

export const metadata: Metadata = { title: 'Sign In' }

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-brand-300 blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-brand-600 font-bold text-lg">S</span>
            </div>
            <span className="text-white font-semibold text-xl">SalesCRM</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              Close deals faster.<br />Build relationships that last.
            </h1>
            <p className="text-brand-200 text-lg leading-relaxed">
              The modern CRM built for high-performance sales teams. Pipeline management, contact tracking, and revenue analytics — all in one place.
            </p>
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { label: 'Deals Tracked', value: '12,400+' },
            { label: 'Avg Close Rate', value: '34%' },
            { label: 'Revenue Managed', value: '$2.4B' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-white font-bold text-2xl">{stat.value}</p>
              <p className="text-brand-200 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="font-semibold text-lg">SalesCRM</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
          <p className="text-muted-foreground mb-8">Sign in to your account to continue</p>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
