import { Metadata } from 'next'
import ResetPasswordForm from '@/components/auth/reset-password-form'

export const metadata: Metadata = { title: 'Reset Password' }

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <span className="font-semibold text-lg">SalesCRM</span>
        </div>
        <h2 className="text-3xl font-bold mb-2">Set new password</h2>
        <p className="text-muted-foreground mb-8">
          Enter and confirm your new password below.
        </p>
        <ResetPasswordForm />
      </div>
    </div>
  )
}
