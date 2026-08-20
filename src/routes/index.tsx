import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { authClient } from '#/lib/auth-client'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()

  const handleLogout = async () => {
    await authClient.signOut()
    navigate({ to: '/login' })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
      <div className="w-full max-w-2xl text-center space-y-6 bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Welcome to <span className="text-indigo-600 dark:text-indigo-400">CleanLabel</span>
        </h1>
        
        {isPending ? (
          <p className="text-lg text-slate-600 dark:text-slate-300 animate-pulse">Loading session...</p>
        ) : session ? (
          <div className="space-y-4 flex flex-col items-center">
            <p className="text-lg text-slate-600 dark:text-slate-300">
              You are logged in as <span className="font-semibold text-slate-900 dark:text-white">{session.user.name || session.user.email}</span>.
            </p>
            <Button 
              onClick={handleLogout} 
              variant="destructive"
              size="lg"
              className="mt-4 font-bold shadow-lg hover:-translate-y-0.5 transition-transform w-48"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="space-y-4 flex flex-col items-center">
            <p className="text-lg text-slate-600 dark:text-slate-300">
              You are not logged in.
            </p>
            <Button 
              onClick={() => navigate({ to: '/login' })}
              size="lg"
              className="mt-4 font-bold shadow-lg hover:-translate-y-0.5 transition-transform bg-indigo-600 hover:bg-indigo-700 text-white w-48"
            >
              Go to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
