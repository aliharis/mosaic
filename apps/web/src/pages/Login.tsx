import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/common/Button";
import { supabase } from "@/config/supabase";

const PROFILE_COLORS = [
  "#FFB5E8", // Pink
  "#B5DEFF", // Blue
  "#B5FFB8", // Green
  "#FFB5B5", // Red
  "#D5B5FF", // Purple
  "#FFE5B5", // Orange
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [color, setColor] = useState(PROFILE_COLORS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check if user is already authenticated
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;

    try {
      setIsLoading(true);
      setMessage("");

      // Send magic link to email
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          data: {
            name: name.trim(),
            color,
          },
        },
      });

      if (error) throw error;

      setMessage("Check your email for the login link!");
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to send login link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center relative bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 animate-gradient">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Welcome to Mosaic
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Please enter your details to get started
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your email"
              required
              autoFocus
            />
          </div>

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

          {message && (
            <div className={`text-sm text-center ${message.includes("Check") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </div>
          )}

          <Button 
            disabled={!email.trim() || !name.trim()} 
            fullWidth 
            isLoading={isLoading}
          >
            Send Login Link
          </Button>
        </form>
      </div>
    </div>
  );
}
