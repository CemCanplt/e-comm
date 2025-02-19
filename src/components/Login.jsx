import { useState, useEffect } from "react"; // useEffect'i ekleyin
import { useSelector } from "react-redux"; // useSelector'ı ekleyin
import { useForm } from "react-hook-form";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loginUser } from "../store/actions/userActions";

function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const { from } = location.state || { from: { pathname: "/" } };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm({
    mode: "onChange",
  });

  // Redux'tan authentication durumunu al
  const { isAuthenticated } = useSelector((state) => state.user);
  const [showWarning, setShowWarning] = useState(false);

  // Kullanıcı zaten giriş yapmışsa uyarı göster
  // isAuthenticated değiştiğinde showWarning'i güncelle
  useEffect(() => {
    setShowWarning(isAuthenticated);
  }, [isAuthenticated]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await dispatch(
        loginUser({
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe,
          switchAccount: isAuthenticated, // Yeni parametre
        })
      );

      toast.success("Login successful!", {
        position: "top-center",
        autoClose: 3000,
      });
      setShowWarning(false);
      history.replace(from);
    } catch (error) {
      toast.error(error?.message || "Invalid email or password", {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        {showWarning && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Aktif Oturum Mevcut
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Zaten giriş yapmış durumdasınız.
                    <br />
                    Gene de farklı bir hesapla giriş yapabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-(--Bandage-Rengi)">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-(--ikinci-metin-rengi)">
            Or{" "}
            <Link
              to="/signup"
              className="font-medium text-(--ilk-renk) hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                })}
                className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                {...register("rememberMe")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || !isValid || !isDirty}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white 
                ${
                  isSubmitting || !isValid || !isDirty
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[var(--ilk-renk)] hover:bg-blue-700"
                }`}
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : null}
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
