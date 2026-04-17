/**
 * @typedef {(campo: string, enumerado: object) => void} EnumValidator
 */

/**
 * @typedef {(longitud: number, valor: string) => void} MinLongValidator
 */

/**
 * @typedef {(objetoInstancia: object, clase: class) => void} InstanceValidator
 */

/**
 * @typedef {(valor: string) => void} StringValidator
 */

function validadorGenerico( predicado, errorHandler ) {
    // validadorGenerico tiene que devolver una función, para que sea ejecutable por EsString
    // Lo que hacemos es crear una función que tiene una función "interna" que se ejecuta cuando llamamos a EsString
    // y junta todos los parametros que recibe EsString en ese ...args, (esto quiere decir que tanto el predicado como el errorHandler van a tener los mismos parametros)
    return function(...args) {
        if(!predicado(...args)) errorHandler(...args)
    }
}

// Si no EsString ejecutaría la función validadorGenerico, y no queremos esto
// Queremos que EsString se ejecute cuando se llame al mismo CON PARAMETROS
/**
 * @type {StringValidator} 
 */
const EsString = validadorGenerico(
    (valor) => typeof valor === 'string',
    () => { throw new Error('El tipo debe ser string') } 
)

/**
 * @type {MinLongValidator}
 */
const MinLong = validadorGenerico(
    (longitud, valor) => valor.length > longitud,
    (longitud, valor) => { throw new Error(`El valor ${valor} debe tener una longitud mínima de ${longitud}`)}
)

/**
 * @type {InstanceValidator}
 */
export const EsInstanciaDe = validadorGenerico(
    (instancia, clase) => instancia instanceof clase,
    (instancia, clase) => { throw new Error(`El valor ${instancia} no es instancia de ${clase}`)}
)

export const EstanPresentes = validadorGenerico(
    (...args) => args.every( parametro => typeof parametro !== 'undefined' ),
    (...args) => { throw new Error(`Faltan definir atributos de la clase`) }
)

/**
 * @type {EnumValidator}
 */
export const ElEnumTiene = validadorGenerico(
    (campo, enumerado) => Object.values(enumerado).includes(campo),
    (campo, enumerado) => { throw new Error(`El campo ${campo} no existe en ${enumerado}`) }
)

class Usuario {
    nombre;
    edad;
    curso;
    constructor(nombre, edad, curso) {
        EstanPresentes(nombre, edad, curso)
    }
}

// PRUEBA
try {
    // const u = new Usuario("Luca", 18); // error
    // console.log("Nombre:", u.nombre);
    // const u2 = new Usuario("L"); // error
    // const e = new Usuario(123); // error
} catch (error) {
    console.error("❌", error.message);
}