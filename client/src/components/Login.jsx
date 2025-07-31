import React from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const Login = () => {
  const {
    setShowUserLogin,
    setUser,
    axios,
    navigate,
    postLoginAction,
    setPostLoginAction,
  } = useAppContext();
  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  // Google Sign-In Handler
  const handleGoogleSignIn = () => {
    // Load Google Sign-In script if not already loaded
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogleSignIn;
      document.head.appendChild(script);
    } else {
      initGoogleSignIn();
    }
  };

  // Initialize Google Sign-In on component mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleGoogleSignIn();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const initGoogleSignIn = () => {
    window.google.accounts.id.initialize({
      client_id:
        "842143909368-bad0eafbd2p2u42uhbncbdam5bdbhfho.apps.googleusercontent.com",
      callback: handleCredentialResponse,
      use_fedcm_for_prompt: false, // Disable FedCM for better compatibility
    });

    // Use renderButton instead of prompt for more reliable behavior
    window.google.accounts.id.renderButton(
      document.getElementById("google-signin-button"),
      {
        theme: "outline",
        size: "large",
        width: "100%",
        text: "continue_with",
      }
    );
  };

  const handleCredentialResponse = async (response) => {
    try {
      const { data } = await axios.post("/api/user/google-signin", {
        credential: response.credential,
      });

      if (data.success) {
        toast.success("Signed in with Google successfully");
        navigate("/");
        setUser(data.user);
        setShowUserLogin(false);
        if (postLoginAction) {
          postLoginAction();
          setPostLoginAction(null);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Google sign-in failed");
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === "login") {
      // ✅ LOGIN FLOW
      try {
        const { data } = await axios.post(`/api/user/login`, {
          email,
          password,
        });
        if (data.success) {
          toast.success("Logged in successfully");
          navigate("/");
          setUser(data.user);
          setShowUserLogin(false);
          if (postLoginAction) {
            postLoginAction();
            setPostLoginAction(null);
          }
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      // ✅ REGISTER FLOW (Step 1: Send OTP)
      try {
        const { data } = await axios.post("/api/user/register-temp", {
          name,
          email,
          password,
        });

        if (data.success) {
          toast.success("OTP sent to your email");

          // Store form data in context or localStorage
          localStorage.setItem(
            "tempUser",
            JSON.stringify({ name, email, password })
          );

          // Navigate to OTP verification page
          setTimeout(() => {
            navigate("/verify-otp");
            setShowUserLogin(false);
          }, 100);
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      }
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    // Regex: only letters and spaces allowed
    const isValid = /^[A-Za-z\s]*$/.test(value);

    if (isValid) {
      setName(value);
    } else {
      toast.error("Username should strictly contain alphabets only.");
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-[#4fbf8b]">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {/* Google Sign-In Button Container */}
        <div id="google-signin-button" className="w-full"></div>

        {/* Fallback Custom Button (in case Google button doesn't render) */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-all duration-200 text-gray-700 font-medium"
          style={{ display: "none" }}
          id="custom-google-button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="w-full flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-xs">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={handleNameChange}
              value={name}
              placeholder="Enter your full name"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-[#4fbf8b]"
              type="text"
              required
            />
          </div>
        )}

        <div className="w-full ">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter your email"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-[#4fbf8b]"
            type="email"
            required
          />
        </div>

        <div className="w-full ">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Enter your password"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-[#4fbf8b]"
            type={showPassword ? "text" : "password"}
            required
          />
          {/* Show Password Checkbox */}
          <label className="text-sm mt-1 inline-flex items-center gap-1 select-none cursor-pointer">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
              className="cursor-pointer"
            />
            Show Password
          </label>
        </div>

        {state === "register" ? (
          <p>
            Already have account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-indigo-500 cursor-pointer"
            >
              Click Here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-indigo-500 cursor-pointer"
            >
              Click Here
            </span>
          </p>
        )}

        <button className="bg-green-600 hover:bg-green-700 transition-all text-white w-full py-2 rounded-md cursor-pointer">
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
