import { useAuth } from "@/context/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/common/Button";

const PROFILE_COLORS = [
  "#FFB5E8", // Pink
  "#B5DEFF", // Blue
  "#B5FFB8", // Green
  "#FFB5B5", // Red
  "#D5B5FF", // Purple
  "#FFE5B5", // Orange
];

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [color, setColor] = useState(PROFILE_COLORS[0]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setIsLoading(true);
      login({ name: name.trim(), color });
      setIsLoading(false);
      navigate("/dashboard");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center relative bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 animate-gradient">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Welcome to Mosaic
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Please create your profile to get started
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your name"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Choose Your Color
            </label>
            <div className="mt-2 flex flex-wrap gap-3">
              {PROFILE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    color === c
                      ? "border-blue-500 ring-2 ring-blue-500 ring-offset-2"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <Button disabled={!name.trim()} fullWidth isLoading={isLoading}>
            Get Started
          </Button>
        </form>
      </div>
    </div>
  );
}
