import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Enter your work email and password to continue.");
      return;
    }
    setError(null);
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-16">
      <div className="w-full max-w-[460px] z-10">
        <GlassCard padding="lg" className="rounded-2xl">
          <Link to="/" className="flex flex-col items-center mb-8 group">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-primary via-secondary to-pinky flex items-center justify-center mb-4 shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">MeetWise AI</h1>
            <p className="text-xs text-gray-400 mt-2 text-center">Welcome back. Enter your workspace details.</p>
          </Link>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400" htmlFor="email">
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-white/5 rounded-xl bg-white/5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm text-white placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400" htmlFor="password">
                  Password
                </label>
                <a className="text-xs text-primary hover:text-pinky transition-colors font-medium" href="#">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-white/5 rounded-xl bg-white/5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm text-white placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <div className="flex items-center pt-1">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-white/10 text-primary bg-white/5 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <label className="ml-2 block text-xs text-gray-400 cursor-pointer" htmlFor="remember-me">
                Remember workspace session for 30 days
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary via-secondary to-pinky hover:shadow-lg hover:shadow-primary/30 transition-all text-white font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] duration-200 shadow-md flex items-center justify-center gap-2"
              >
                Launch Workspace <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 w-full border-t border-white/5" />
              <span className="relative px-3 bg-[#050505] text-[10px] uppercase tracking-wider text-gray-500">
                Or integrate workspace
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex items-center justify-center gap-2 py-2.5 border border-white/5 rounded-xl bg-white/5 text-xs text-white hover:bg-white/10 hover:border-white/10 transition-all"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex items-center justify-center gap-2 py-2.5 border border-white/5 rounded-xl bg-white/5 text-xs text-white hover:bg-white/10 hover:border-white/10 transition-all"
              >
                <svg className="h-4 w-4" viewBox="0 0 21 21">
                  <path d="M10 0H0v10h10V0zM21 0H11v10h10V0zM10 11H0v10h10V11zM21 11H11v10h10V11z" fill="#00a4ef" />
                </svg>
                Microsoft
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-gray-500">
            New to MeetWise?{" "}
            <Link className="text-primary hover:underline font-semibold" to="/dashboard">
              Create Workspace
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
