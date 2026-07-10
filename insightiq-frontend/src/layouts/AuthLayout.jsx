function AuthLayout({ left, right }) {
  return (
    <div className="min-h-screen bg-[#F6F5F2] grid lg:grid-cols-2">

      {/* Left Section */}
      <div className="hidden lg:flex items-center justify-center p-16">
        {left}
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        {right}
      </div>

    </div>
  );
}

export default AuthLayout;