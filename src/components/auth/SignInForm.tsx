import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import Swal from "sweetalert2";

export default function SignInForm() {

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [formData, setFormData] = useState({
    usuario: "",
    contraseña: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (error) setError("");

  };


  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);
    setError("");

    try {

      const response = await fetch("https://api-integracion-movil.vercel.app//login", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        credentials: "include",

        body: JSON.stringify({
          usuario: formData.usuario,
          contraseña: formData.contraseña
        })

      });

      const data = await response.json();

      if (!response.ok) {

        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Usuario o contraseña incorrectos"
        });

        setLoading(false);
        return;

      }

      if (data.success) {

        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("sede", data.user.sede);

        Swal.fire({
          icon: "success",
          title: "Login exitoso",
          text: `Bienvenido ${data.user.nombre}`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Entrar"
        }).then(() => {

          navigate("/cobradores");

        });

      }

    } catch (err) {

      console.error("Error:", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo conectar con el servidor"
      });

    }

    setLoading(false);

  };



  return (
    <div className="flex flex-col flex-1">

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">

        <div>

          <div className="mb-5 sm:mb-8">

            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm">
              Sign In
            </h1>

            <p className="text-sm text-gray-500">
              Enter your username and password to sign in!
            </p>

          </div>


          {error && (
            <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 rounded-lg">
              {error}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            <div className="space-y-6">

              <div>

                <Label>
                  Usuario
                </Label>

                <Input
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleChange}
                  placeholder="Ingresa tu usuario"
                  disabled={loading}
                  required
                />

              </div>


              <div>

                <Label>
                  Contraseña
                </Label>

                <div className="relative">

                  <Input
                    name="contraseña"
                    type={showPassword ? "text" : "password"}
                    value={formData.contraseña}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña"
                    disabled={loading}
                    required
                  />

                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute cursor-pointer right-4 top-3"
                  >

                    {showPassword ? (
                      <EyeIcon className="size-5" />
                    ) : (
                      <EyeCloseIcon className="size-5" />
                    )}

                  </span>

                </div>

              </div>


              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <Checkbox
                    checked={isChecked}
                    onChange={setIsChecked}
                  />

                  <span className="text-sm">
                    Keep me logged in
                  </span>

                </div>

              </div>


              <Button
                className="w-full"
                size="sm"
                type="submit"
                disabled={loading}
              >

                {loading ? "Iniciando sesión..." : "Iniciar sesión"}

              </Button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );

}