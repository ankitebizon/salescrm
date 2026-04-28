import { Metadata } from 'next'
import ForgotPasswordForm from '@/components/auth/forgot-password-form'

export const metadata: Metadata = { title: 'Forgot Password' }

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <span className="font-semibold text-lg">SalesCRM</span>
        </div>
        <h2 className="text-3xl font-bold mb-2">Forgot password?</h2>
        <p className="text-muted-foreground mb-8">
          Enter your email and we&apos;ll send you a reset link.
        </p>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
