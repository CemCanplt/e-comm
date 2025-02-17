import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import useAxios, { METHODS } from "../hooks/useAxios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignUp() {
  const [roles, setRoles] = useState([]);
  const [isStore, setIsStore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage("isLoggedIn", false);

  const { sendRequest, loading } = useAxios({
    baseURL: "https://workintech-fe-ecommerce.onrender.com",
    consoleLog: true,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      role_id: 3, // roleId -> role_id
    },
  });

  useEffect(() => {
    sendRequest({
      url: "/roles",
      method: METHODS.GET,
      callbackSuccess: (data) => {
        setRoles(data);
      },
      callbackError: (error) => {
        console.error("Failed to fetch roles:", error);
        toast.error("Failed to fetch roles. Please try again later.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      },
    });
  }, [sendRequest]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const signupData = isStore
        ? {
            name: data.name,
            email: data.email,
            password: data.password,
            role_id: Number(data.role_id), // roleId -> role_id
            store: {
              name: data.store_name,
              phone: data.store_phone,
              tax_no: data.store_tax_no,
              bank_account: data.store_bank_account,
            },
          }
        : {
            name: data.name,
            email: data.email,
            password: data.password,
            role_id: Number(data.role_id), // roleId -> role_id
          };

      await sendRequest({
        url: "/signup",
        method: METHODS.POST,
        data: signupData,
        callbackSuccess: (responseData) => {
          console.log("Signup Response Data:", responseData);

          toast.warn(
            "You need to click the link in your email to activate your account!",
            {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }
          );
          setIsLoggedIn(false);
          history.goBack();
        },
        callbackError: (error) => {
          console.error("Signup Error:", error?.response?.data); // Gelen hatayı logla

          // SQLite constraint hatası kontrolü (mail zaten kayıtlı)
          const errorData = error?.response?.data;

          if (
            errorData?.err?.errno === 19 &&
            errorData?.err?.code === "SQLITE_CONSTRAINT"
          ) {
            toast.error(
              "This email is already registered. Please try with a different email address.",
              {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              }
            );
          } else {
            // Diğer hata durumları için genel mesaj
            toast.error(
              errorData?.error || errorData?.message || "Signup failed",
              {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              }
            );
          }
        },
        alwaysApply: () => {
          setIsSubmitting(false);
        },
      });
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("An unexpected error occurred", {
        position: "top-center",
        autoClose: 5000,
      });
      setIsSubmitting(false);
    }
  };

  const selectedRole = watch("role_id"); // roleId -> role_id
  useEffect(() => {
    setIsStore(Number(selectedRole) === 2);
  }, [selectedRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-(--Bandage-Rengi)">
            Create Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-(--ikinci-metin-rengi)">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-(--ilk-renk) hover:text-blue-500"
            >
              sign in to your account
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                })}
                className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Name"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                  validate: async (value) => {
                    try {
                      const response = await fetch(
                        `${baseURL}/check-email?email=${value}`
                      );
                      const data = await response.json();
                      return (
                        data.available || "This email is already registered"
                      );
                    } catch (error) {
                      return true;
                    }
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
                  minLength: {
                    value: 8,
                    message:
                      "Password must be at least 8 characters including numbers, lower case, upper case and special chars",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/,
                    message:
                      "Password must be at least 8 characters including numbers, lower case, upper case and special chars",
                  },
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
            <div>
              <label htmlFor="password_repeat" className="sr-only">
                Password Repeat
              </label>
              <input
                id="password_repeat"
                type="password"
                {...register("password_repeat", {
                  required: "Password repeat is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                  errors.password_repeat ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Password Repeat"
              />
              {errors.password_repeat && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password_repeat.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="role_id" className="sr-only">
                Role
              </label>
              <select
                id="role_id"
                {...register("role_id")} // roleId -> role_id
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isStore && (
            <div className="rounded-md space-y-4">
              <div>
                <label htmlFor="store_name" className="sr-only">
                  Store Name
                </label>
                <input
                  id="store_name"
                  {...register("store_name", {
                    required: "Store Name is required",
                    minLength: {
                      value: 3,
                      message: "Store Name must be at least 3 characters",
                    },
                  })}
                  className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                    errors.store_name ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Store Name"
                />
                {errors.store_name && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.store_name.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="store_phone" className="sr-only">
                  Store Phone
                </label>
                <input
                  id="store_phone"
                  {...register("store_phone", {
                    required: "Store Phone is required",
                    pattern: {
                      value:
                        /^(05)([0-9]{2})\s?([0-9]{3})\s?([0-9]{2})\s?([0-9]{2})$/,
                      message: "Invalid Türkiye phone number",
                    },
                  })}
                  className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                    errors.store_phone ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Store Phone (05xxxxxxxxx)"
                />
                {errors.store_phone && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.store_phone.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="store_tax_no" className="sr-only">
                  Store Tax ID
                </label>
                <input
                  id="store_tax_no"
                  {...register("store_tax_no", {
                    required: "Store Tax ID is required",
                    pattern: {
                      value: /^T\d{4}V\d{6}$/,
                      message: "Invalid Tax ID format (TXXXXVXXXXXX)",
                    },
                  })}
                  className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                    errors.store_tax_no ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Store Tax ID (TXXXXVXXXXXX)"
                />
                {errors.store_tax_no && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.store_tax_no.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="store_bank_account" className="sr-only">
                  Store Bank Account
                </label>
                <input
                  id="store_bank_account"
                  {...register("store_bank_account", {
                    required: "Store Bank Account is required",
                    pattern: {
                      value: /^TR[0-9]{24}$/,
                      message: "Invalid IBAN address",
                    },
                  })}
                  className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                    errors.store_bank_account
                      ? "border-red-500"
                      : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Store Bank Account (TRxxxxxxxxxxxxxxxxxxxxxx)"
                />
                {errors.store_bank_account && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.store_bank_account.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--ilk-renk)] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isSubmitting ? (
                <svg
                  className="animate-spin h-5 w-5 mr-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : null}
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
