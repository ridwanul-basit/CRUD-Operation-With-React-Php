import { useState } from "react";
import { useNavigate } from "react-router"; // import navigate
import Swal from "sweetalert2";

function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate(); // create navigate function

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost/college_api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // for PHP session
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire("Welcome!", result.message, "success").then(() => {
          navigate("/adminpanel"); // navigate to admin panel route
        });
      } else {
        Swal.fire("Error", result.message, "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="card w-full max-w-md shadow-2xl bg-white/80 backdrop-blur-xl border border-gray-200">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center text-primary mb-6">Admin Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label pr-2"><span className="label-text">Email: </span></label>
              <input
                type="email"
                name="email"
                placeholder="Enter admin email"
                className="input input-bordered"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control">
              <label className="label pr-2"><span className="label-text">Password: </span></label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                className="input input-bordered"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary w-full">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
