import { useForm } from "react-hook-form";

function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm({
    mode: "onBlur",
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    // Burada form gönderim işlemini yapabilirsin.
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile View */}
      <div className="block md:hidden p-4">
        <h1 className="text-xl font-bold text-center mb-4">Contact Us</h1>
        <p className="text-center mb-4">
          Please use the form below to send your inquiries.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            {...register("name", { required: "Name is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
          <textarea
            placeholder="Message"
            {...register("message", { required: "Message is required" })}
            className="w-full p-2 border rounded"
            rows="4"
          ></textarea>
          {errors.message && (
            <p className="text-red-500 text-xs">{errors.message.message}</p>
          )}
          <button
            type="submit"
            disabled={!isValid || !isDirty}
            className="w-full p-2 bg-(--ilk-renk) text-white rounded disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block p-10">
        <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Name"
                {...register("name", { required: "Name is required" })}
                className="w-1/2 p-3 border rounded"
              />
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
                className="w-1/2 p-3 border rounded"
              />
            </div>
            <textarea
              placeholder="Your Message"
              {...register("message", { required: "Message is required" })}
              className="w-full p-3 border rounded"
              rows="6"
            ></textarea>
            <button
              type="submit"
              disabled={!isValid || !isDirty}
              className="w-full p-3 bg-(--ilk-renk) cursor-pointer text-white rounded disabled:opacity-50"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
