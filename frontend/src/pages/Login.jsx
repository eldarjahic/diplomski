function Login() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-600">Sign in to your account</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900">Password</label>
              <a className="text-xs font-medium text-gray-600 hover:text-gray-900" href="#">Forgot?</a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>

          <button
            type="button"
            className="mt-2 w-full rounded-lg border border-gray-900 bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <a className="font-semibold text-gray-900" href="/register">Create one</a>
        </p>
      </div>
    </main>
  );
}

export default Login;


