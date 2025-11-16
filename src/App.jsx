import { useState } from 'react'

function Input({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  )
}

function Button({ children, onClick, type = 'button', loading }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
    >
      {loading ? 'Please wait...' : children}
    </button>
  )
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  )
}

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function App() {
  const [tab, setTab] = useState('signup') // signup | login | forgot
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [token, setToken] = useState('')

  const resetState = () => {
    setMessage('')
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    resetState()
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Signup failed')
      setMessage(data.message || 'Signup successful')
      setTab('login')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    resetState()
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login failed')
      setToken(data.token)
      setMessage('Login successful!')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleForgot = async (e) => {
    e.preventDefault()
    resetState()
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/auth/forgot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Request failed')
      setMessage(data.message + (data.token ? ` (demo code: ${data.token})` : ''))
      setTab('reset')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    resetState()
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/auth/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, new_password: newPassword })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Reset failed')
      setMessage('Password reset successful. You can log in now.')
      setTab('login')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-violet-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Exam Portal</h1>
          <p className="text-gray-600">Create your account, sign in, or reset your password</p>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex gap-2 mb-6">
            <TabButton active={tab === 'signup'} onClick={() => setTab('signup')}>Sign Up</TabButton>
            <TabButton active={tab === 'login'} onClick={() => setTab('login')}>Log In</TabButton>
            <TabButton active={tab === 'forgot'} onClick={() => setTab('forgot')}>Forgot</TabButton>
          </div>

          {message && (
            <div className="mb-4 rounded-md bg-blue-50 text-blue-800 border border-blue-200 px-3 py-2 text-sm">{message}</div>
          )}

          {tab === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <Input label="Full name" value={name} onChange={setName} placeholder="Jane Doe" />
              <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="jane@example.com" />
              <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
              <Button type="submit" loading={loading}>Create account</Button>
            </form>
          )}

          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="jane@example.com" />
              <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">No account? <button type="button" className="text-blue-600 hover:underline" onClick={() => setTab('signup')}>Sign up</button></div>
                <button type="button" className="text-sm text-blue-600 hover:underline" onClick={() => setTab('forgot')}>Forgot password?</button>
              </div>
              <Button type="submit" loading={loading}>Log in</Button>
              {token && (
                <div className="text-xs text-gray-500 break-all">Demo token: {token}</div>
              )}
            </form>
          )}

          {tab === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="jane@example.com" />
              <Button type="submit" loading={loading}>Send reset code</Button>
            </form>
          )}

          {tab === 'reset' && (
            <form onSubmit={handleReset} className="space-y-4">
              <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="jane@example.com" />
              <Input label="Reset code" value={code} onChange={setCode} placeholder="6-digit code" />
              <Input label="New password" type="password" value={newPassword} onChange={setNewPassword} placeholder="••••••••" />
              <Button type="submit" loading={loading}>Reset password</Button>
            </form>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">Backend: {baseUrl}</p>
      </div>
    </div>
  )
}
