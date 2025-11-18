import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface AuthButtonProps {
  hideSignin?: boolean,
  hideSignup?: boolean,
  signupText?: string,
  signinText?: string
}

export const AuthButton = ({ hideSignin, hideSignup, signinText, signupText }: AuthButtonProps) => {
  return (
    <div className="flex items-center gap-x-3">
      {!hideSignin && (
        <Button asChild variant="outline" className="card-bg hover:bg-secondary">
          <Link href="/signin">{signinText || "SignIn"}</Link>
        </Button>
      )}

      {!hideSignup && (
        <Button asChild>
          <Link href="/signup">{signupText || "SignUp"}</Link>
        </Button>
      )}

    </div>
  )
}
