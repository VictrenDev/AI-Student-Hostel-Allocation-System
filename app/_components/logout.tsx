"use client";
const Logout = () => {
  const logout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        // Optionally redirect to login
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="absolute top-0 left-0 w-full z-50 p-6 transition-all bg-transparent">
      <div className="max-w-7xl mx-auto flex justify-end items-center">
        <div className="text-[var(--color-primary-500)] font-medium">
          <button onClick={() => logout()}>Logout</button>
        </div>
      </div>
    </header>
  );
};

export default Logout;
