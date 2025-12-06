import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, Loader2 } from 'lucide-react';

// URL de tu API proporcionada
const API_URL = 'https://unregenerable-nonaesthetically-lara.ngrok-free.dev/api/gempleados/area/compras';

const Login = () => {
  const [codigoEmpleado, setCodigoEmpleado] = useState('');
  const [documentoIdentidad, setDocumentoIdentidad] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Consumir la API para obtener la lista de empleados
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Header a veces necesario para evitar la pantalla de advertencia de ngrok
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) {
        throw new Error('Error al conectar con el servidor de empleados');
      }

      const empleadosAPI = await response.json();

      // 2. AGREGAR USUARIO FICTICIO - Ricardo Arjona como Gerente de Compras
      const usuarioFicticio = {
        idEmpleado: 999,
        codigoEmpleado: "EMP-102",
        nombres: "Ricardo",
        apellidoPaterno: "Arjona",
        apellidoMaterno: "Torres",
        documentoIdentidad: "12345678",
        tipoDocumento: "DNI",
        fechaNacimiento: "1975-05-15",
        genero: "M",
        estadoCivil: "CASADO",
        nacionalidad: "Peruana",
        direccion: "Av. Principal 123, San Isidro, Lima",
        telefono: "999888777",
        email: "ricardo.arjona@railway.com",
        emailCorporativo: "r.arjona@railway.com",
        fechaIngreso: "2020-01-15",
        fechaCese: null,
        estado: "ACTIVO",
        tipoContrato: "JORNADA_COMPLETA",
        modalidadTrabajo: "PRESENCIAL",
        idPuesto: 100,
        nombrePuesto: "Gerente de Compras",
        departamento: "Compras",
        area: "Compras",
        nivelJerarquico: "GERENTE",
        salarioMinimo: 8000.0,
        salarioMaximo: 12000.0,
        fechaInicioPuesto: "2020-01-15",
        fechaFinPuesto: null,
        salarioAsignado: 10500.00
      };

      // 3. Combinar empleados de la API con el usuario ficticio
      const empleados = [...empleadosAPI, usuarioFicticio];

      // 4. Buscar si existe un empleado que coincida con el Código y el DNI
      const usuarioEncontrado = empleados.find(emp =>
        emp.codigoEmpleado.trim() === codigoEmpleado.trim() &&
        emp.documentoIdentidad.trim() === documentoIdentidad.trim()
      );

      if (usuarioEncontrado) {
        console.log('Login exitoso:', usuarioEncontrado);
        
        // 5. Guardar sesión y redirigir
        localStorage.setItem('user', JSON.stringify(usuarioEncontrado));
        
        // Redirige a la ruta solicitada
        navigate('/solicitudes');
      } else {
        // Si no se encuentra coincidencia
        setError('Credenciales incorrectas. Verifica tu Código o DNI.');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión. Por favor intente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Verificar si el código ingresado es del gerente (Arjona)
  const esGerente = codigoEmpleado.trim() === 'EMP-102';

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
      {/* Animated Background Shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      <div className="absolute top-[40%] left-[10%] w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />

      <div className="w-full max-w-md p-8 mx-4 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-10 transform transition-all hover:scale-[1.02] duration-300">
          <div className="text-center mb-8">
            {/* Avatar con foto de Arjona o icono de usuario */}
            <div className="inline-block relative mb-4">
              {esGerente ? (
                // Mostrar foto de Arjona cuando es el gerente
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-blue-500 shadow-lg">
                  <img 
                    src="/arjona.jpg" 
                    alt="Ricardo Arjona - Gerente de Compras" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                // Mostrar icono genérico para otros usuarios
                <div className="p-4 bg-blue-500 rounded-2xl">
                  <User className="h-12 w-12 text-white" />
                </div>
              )}
            </div>

            <h1 className="text-4xl font-bold text-blue-500 mb-2 tracking-tight">
              {esGerente ? '¡Hola Gerente!' : 'Bienvenido'}
            </h1>
            <p className="text-gray-600 text-sm">Sistema de Gestión de Compras</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Código de Empleado</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-blue-500 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="text"
                  value={codigoEmpleado}
                  onChange={(e) => setCodigoEmpleado(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Ej: EMP-102"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Documento de Identidad (DNI)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-500 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="password"
                  value={documentoIdentidad}
                  onChange={(e) => setDocumentoIdentidad(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Ej: 12345678"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-4 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Ingresar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-white/80 text-xs">
          &copy; {new Date().getFullYear()} Módulo de Compras G7. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
};

export default Login;