import axios from 'axios';

const API_URL = 'https://unregenerable-nonaesthetically-lara.ngrok-free.dev/api/gempleados/area/compras';

export interface Employee {
  idEmpleado: number;
  codigoEmpleado: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  documentoIdentidad: string;
  email: string;
  nombrePuesto: string;
  area: string;
}

export const login = async (codigoEmpleado: string, documentoIdentidad: string): Promise<Employee> => {
  try {
    const response = await axios.get<Employee[]>(API_URL);
    const employees = response.data;

    const user = employees.find(
      (emp) => emp.codigoEmpleado === codigoEmpleado && emp.documentoIdentidad === documentoIdentidad
    );

    if (user) {
      return user;
    } else {
      throw new Error('Credenciales inválidas');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
