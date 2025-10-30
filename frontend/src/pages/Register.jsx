function Register() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-600">Join to save favorites and get alerts</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">Full name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">Confirm password</label>
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
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a className="font-semibold text-gray-900" href="/login">Sign in</a>
        </p>
      </div>
    </main>
  );
}

export default Register;


