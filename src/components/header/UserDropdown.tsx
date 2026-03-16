import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const API_BASE_URL = 'https://api-integracion-movil.vercel.app/';

interface UserData {
  id: number;
  nombre: string;
  usuario: string;
  rol: string;
  sede: number;
  nombre_sede: string;
}

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar datos del usuario desde localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error('Error al parsear usuario:', error);
      }
    }
  }, []);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Limpiar localStorage
        localStorage.removeItem('user');

        // Mostrar mensaje de éxito
        Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión exitosamente',
          timer: 2000,
          showConfirmButton: false,
          position: 'top-end',
          toast: true
        });

        // Redirigir al login
        navigate('/signin');
      } else {
        throw new Error('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error en logout:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cerrar la sesión',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  // Función para obtener iniciales del nombre
  const getInitials = (nombre: string) => {
    return nombre
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Función para obtener color de avatar según rol
  const getAvatarColor = (rol: string) => {
    switch (rol) {
      case 'admin':
        return 'bg-purple-600';
      case 'supervisor':
        return 'bg-blue-600';
      default:
        return 'bg-green-600';
    }
  };

  // Si no hay usuario, mostrar un placeholder o null
  if (!user) {
    return null; // O puedes mostrar un skeleton loader
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          {user?.nombre ? (
            <div className={`w-full h-full ${getAvatarColor(user.rol)} flex items-center justify-center text-white font-semibold text-lg`}>
              {getInitials(user.nombre)}
            </div>
          ) : (
            <img src="/images/user/owner.jpg" alt="User" />
          )}
        </span>

        <span className="hidden sm:block mr-1 font-medium text-theme-sm">
          {user?.nombre?.split(' ')[0] || 'Usuario'}
        </span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[280px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        {/* Información del usuario */}
        <div className="px-2">
          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
            {user.nombre}
          </span>
          <div className="flex items-center gap-2 mt-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                            ${user.rol === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' :
                user.rol === 'supervisor' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                  'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'}`}>
              {user.rol === 'admin' ? 'Administrador' :
                user.rol === 'supervisor' ? 'Supervisor' : 'Usuario'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Sede #{user.nombre_sede}
            </span>
          </div>
        </div>

        {/* Botón de Cerrar Sesión */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 w-full text-left"
        >
          <svg
            className="fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
              fill=""
            />
          </svg>
          Cerrar sesión
        </button>
      </Dropdown>
    </div>
  );
}