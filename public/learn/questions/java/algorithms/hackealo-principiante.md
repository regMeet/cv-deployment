# Principiante

**Origin:** Hackealo &nbsp;|&nbsp; **Topics:** Hash Map

*Source:* `hackealo/Principiante.java`

## Problem

Debido al reciente éxito de la aplicación de mensajería “GuatsApp”, se nos pide realizar un algoritmo que nos diga quiénes son sus usuarios más populares.
Tenemos un listado de mensajes definidos como (string remitente, string destinatario, string texto). Queremos saber cuál es el usuario que ha recibido más
caracteres de texto.

// Para testear tu código en nuestros servidores debes mantener la estructura expuesta abajo.
// Eres libre de crear nuevas funciones/procedimientos.
// Recuerda que el código que escribas podrá ser visto por las empresas a las que te postules.

## Solution

```java
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

/*
 * Debido al reciente éxito de la aplicación de mensajería “GuatsApp”, se nos pide realizar un algoritmo que nos diga quiénes son sus usuarios más populares.
 * Tenemos un listado de mensajes definidos como (string remitente, string destinatario, string texto). Queremos saber cuál es el usuario que ha recibido más
 * caracteres de texto.
 * 
 * // Para testear tu código en nuestros servidores debes mantener la estructura expuesta abajo.
 * // Eres libre de crear nuevas funciones/procedimientos.
 * // Recuerda que el código que escribas podrá ser visto por las empresas a las que te postules.
 * 
 */
public class Principiante {

    private static Map<String, Integer> users = new HashMap<>();

    public static String quien_es_el_mas_popular(String mensaje1[], String mensaje2[], String mensaje3[]) {
        saveCountText(mensaje1);
        saveCountText(mensaje2);
        saveCountText(mensaje3);

        return getMostPopular();
    }

    public static void saveCountText(String[] mensaje) {
        String remitente = mensaje[1];
        String texto = mensaje[2];

        if (users.containsKey(remitente)) {
            users.put(remitente, users.get(remitente) + texto.length());
        } else {
            users.put(remitente, texto.length());
        }
    }

    private static String getMostPopular() {
        String name = "nobody";
        Integer max = 0;

        for (Entry<String, Integer> entry : users.entrySet()) {
            Integer count = entry.getValue();
            if (count > max) {
                max = count;
                name = entry.getKey();
            }
        }

        return name;
    }

    public static void main(String[] args) {
        String mensaje1[] = { "juan", "pedro", "hola como andas?" };
        String mensaje2[] = { "agus", "pedro", "hola! todo bien?" };
        String mensaje3[] = { "jorge", "matias", "buen dia matias!!" };

        String popular = quien_es_el_mas_popular(mensaje1, mensaje2, mensaje3);
        System.out.println(popular);
    }
}
```
