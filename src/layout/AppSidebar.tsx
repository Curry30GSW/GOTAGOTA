import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
  CalenderIcon,
  DollarLineIcon,
  ChevronDownIcon,
  HorizontaLDots,
  UserCircleIcon,
  GroupIcon,
  LockIcon,
  TaskIcon // Necesitas importar o crear este icono
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// Interfaz para los datos del usuario
interface UserData {
  id: number;
  nombre: string;
  usuario?: string;
  rol: string;
  sede: number;           // ✅ Ahora es número
  nombre_sede: string;    // ✅ Nombre aparte
}

const navItems: NavItem[] = [
  {
    icon: <CalenderIcon />,
    name: "Cobradores",
    path: "/cobradores",
  },
  {
    icon: <UserCircleIcon />,
    name: "Clientes",
    path: "/clientes",
  },
  {
    icon: <DollarLineIcon />,
    name: "Creditos",
    path: "/creditos",
  },
  {
    icon: <GroupIcon />,
    name: "Historial Cobradores",
    path: "/historial-cobradores",
  },
  {
    icon: <TaskIcon />,
    name: "Configuracion",
    path: "/sedes",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const [user, setUser] = useState<UserData | null>(null);

  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<number, number>>({});
  const subMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Cargar datos del usuario
  useEffect(() => {
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

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;

    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu(index);
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const el = subMenuRefs.current[openSubmenu];
      if (el) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [openSubmenu]: el.scrollHeight,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu(prev => (prev === index ? null : index));
  };

  // Función para obtener color según el rol
  const getRoleColor = (rol: string) => {
    switch (rol) {
      case 'admin':
        return 'from-blue-500 to-blue-600';
      case 'supervisor':
        return 'from-blue-500 to-blue-600';
      default:
        return 'from-green-500 to-green-600';
    }
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group ${openSubmenu === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={`menu-item-icon-size  ${openSubmenu === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu === index
                    ? "rotate-180 text-brand-500"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`menu-item-icon-size ${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[index] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu === index
                    ? `${subMenuHeight[index] || 0}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link to="/cobradores">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden h-30 w-auto"
                src="/images/logo/cobradores.png"
                alt="Logo"
              />
              <img
                className="hidden dark:block h-30 w-auto"
                src="/images/logo/cobradores.png"
                alt="Logo"
              />
            </>
          ) : (
            <img
              src="/images/logo/cobradores.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>

      {/* 🏢 Sede Info - Nuevo componente */}
      {(isExpanded || isHovered || isMobileOpen) && user && (
        <div className="mb-6 px-2">
          <div className={`bg-gradient-to-r ${getRoleColor(user.rol)} rounded-xl p-4 shadow-lg`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <LockIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/80">Sede actual</p>
                <p className="font-semibold text-white text-sm">
                  {user.nombre_sede}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                <span className="text-xs text-white/90">
                  {user.rol === 'admin' ? 'Administrador' :
                    user.rol === 'supervisor' ? 'Supervisor' : 'Usuario'}
                </span>
              </div>
              <span className="text-xs font-medium text-white/90">
                ID: {user.sede}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Versión compacta para cuando el sidebar está colapsado */}
      {!isExpanded && !isHovered && !isMobileOpen && user && (
        <div className="mb-6 flex justify-center">
          <div className="relative group">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${getRoleColor(user.rol)} flex items-center justify-center shadow-lg cursor-help`}>
              <LockIcon className="w-5 h-5 text-white" />
            </div>

            {/* Tooltip al hacer hover */}
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
              <p className="font-semibold">{user.nombre_sede}</p>
              <p className="text-gray-300 text-[10px] mt-1">ID: {user.sede}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems)}
            </div>
          </div>
        </nav>
        {(isExpanded || isHovered || isMobileOpen) && (
          <div className="mt-auto px-4 pb-6">
            <SidebarWidget />
          </div>
        )}
      </div>
    </aside>
  );
};

export default AppSidebar;