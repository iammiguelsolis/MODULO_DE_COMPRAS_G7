"""
Realiza las validaciones logicas que luego se llevan a la bdd y tampoco es su unica funcion
sino que trabaja con intercambios entre varios metodos para lograr algo mas grande que luego aunque su input 
haya sido de bd finalmente no se refleje en un cambio en la bd sino en data procesada por ejemplo
            AQUI ;)

                NETO VALIDACION PARA REPOSITORY 
public static UsuarioEjercicio[] buscarTodos(int idUsuario){//este buscar todos busca todos los UE relacionados con un usuario especifico
        Usuario a =usuarioService.buscaUsuarioId(idUsuario);
        if (a != null) {
            return usuarioEjercicioRepository.readAll(idUsuario);
        }
        else{
            return null;
        }
    }
                LOGICA DE PROCESAMIENTO DE DATA QUE NO RESULTA EN CAMBIOS EN LA BD
    public static UsuarioEjercicio[] buscarTodosIdUserYEjer(int idUsuario,int idEjercicio){//el que uso para las estadisticas\
        EjercicioService ejercicioService=new EjercicioService();
        Usuario a =usuarioService.buscaUsuarioId(idUsuario);
        Ejercicio e =ejercicioService.buscarEjercicioPorID(idEjercicio);
        if (a != null && e != null) {
            UsuarioEjercicio[] allUsuarioEjercicios = usuarioEjercicioRepository.readAll(idUsuario);
            //filtramos a los que corresponden a un ide ejercicio en particular
            //utilizo array porque con list no funcionaba :(
            int maxTamPosible=allUsuarioEjercicios.length;
            UsuarioEjercicio[] filtrado= new UsuarioEjercicio[maxTamPosible];
            int contadorInterno=0;
            for (int i = 0; i < allUsuarioEjercicios.length; i++) {
                if (idEjercicio==allUsuarioEjercicios[i].getEjercicio().getIdEjercicio()) {
                    filtrado[contadorInterno]=allUsuarioEjercicios[i];
                    contadorInterno++;
                }
            }
            //redimensiono el array
            System.arraycopy(filtrado, 0, filtrado, 0, contadorInterno);//el ultimo valor de contador interno es siempre 1 mas que el max de []
            return filtrado;
        }
        else{
            System.out.println("Algo salio mal");
            return null;
        }
    }
"""