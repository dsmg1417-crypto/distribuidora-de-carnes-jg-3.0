# Distribuidora de Carnes JG

Versión actual de la web, preparada para Vercel. Incluye imágenes locales, ocho combos, detalles individuales y animaciones. No requiere servicios externos ni claves.

## Ver la web localmente

Desde la carpeta del proyecto, con Node.js 20 o superior:

```sh
npm run build
npm start
```

Abrir `http://127.0.0.1:4173`.

## Preparación para Vercel

La configuración está en `vercel.json`: comando de construcción `npm run build`, carpeta de salida `dist` y proyecto estático sin framework.

Al importar el proyecto en Vercel, usar la carpeta que contiene `package.json` como raíz. No cambiar la salida a `public`; `dist` contiene el sitio validado. La configuración usa las opciones oficiales de [Vercel](https://vercel.com/docs/project-configuration).

El sitio todavía no está publicado ni vinculado a una cuenta de Vercel.

## Actualizar combos y precios

Editar `combos.js`. Cada combo tiene su nombre, imagen, lista de contenido y precio. Se usan los precios originales de la tabla, autorizados por el usuario el 4 de octubre de 2026. Para actualizarlos, escribir el número en pesos colombianos sin separadores (ejemplo de formato: `price: 123000`). El adicional de $10.000 no se aplica.

El precio se presenta únicamente en la sección de detalle. Las tarjetas y fotografías nunca muestran el precio. Los enlaces como `/#combo-carnivoro` permiten abrir un combo directamente.

## Navegación

El menú abre una sección independiente cada vez: Inicio, Combos, Res viva, La parrilla, Nosotros y Galería. Las demás secciones permanecen ocultas. Las tarjetas abren el detalle del combo, con su precio original; para regresar al catálogo se usa Combos en el menú. Los enlaces directos como `/#combo-carnivoro` siguen funcionando.

## Movimiento

La portada, los ocho combos y cada detalle conservan sus fotografías originales, con ocho imágenes distintas en las tarjetas. Las capas de llamas y carbón añadidas se retiraron por solicitud del usuario. Se conserva el fuego original de las fotografías. La portada añade pequeños granos de pimienta en movimiento y un humo tenue. La entrada y el acercamiento de las fotos completan la presentación. El ambiente se anima con CSS y se pausa fuera de pantalla o cuando la pestaña está oculta. El recorrido de corte, parrilla y carne asada responde al desplazamiento. Las fotos no contienen video de cocción.

La capa transparente `fire-atlas.webp` se generó con ImageGen de OpenAI y se optimizó en WebP. La capa anterior del mismo bistec en todos los combos se retiró del sitio.

Por solicitud expresa del usuario, el movimiento empieza activo. El visitante puede pausar los efectos con el botón del encabezado; esa preferencia se conserva. La portada ajusta su altura para mostrar el fuego desde la primera pantalla.

También se anuncia la venta de res viva desde el inicio y en una sección propia.

## Datos pendientes

Los dos teléfonos comerciales publicados son los proporcionados expresamente por el usuario para WhatsApp. El carrito permite preparar consultas de pedidos. No se publican nombres de personas, certificados, números de documentos ni teléfonos extraídos de esos documentos. Los datos registrales necesitan aclarar su relación con la marca JG antes de mostrarse. La referencia interna está en `revision-local/ORGANIZACION.md`, fuera del sitio publicado.

Las fotografías de los combos son de presentación. Las listas de contenido se basan en las cantidades enviadas por el negocio.






## Res viva y recorrido de la parrilla

La sección de res viva incluye una fotografía externa ilustrativa de Luis Pérez, alojada en Wikimedia Commons y acreditada en la página bajo CC BY 2.0. No representa inventario de JG. La imagen necesita conexión a Internet. Se añadieron información para preparar la consulta, cotización y entrega, y preguntas frecuentes sin inventar disponibilidad o características del negocio.

En La parrilla, los botones El corte, La parrilla y El asado desplazan al punto correspondiente del mismo recorrido animado. El desplazamiento manual sigue funcionando. Con efectos pausados, los botones permiten seleccionar la imagen sin movimiento.

## Logo transparente

Archivo final: `logo-transparente.png`. Creado con la herramienta integrada ImageGen, a partir del logo original. Se conservó el archivo anterior. Indicación: «Quitar únicamente el fondo negro, conservar el símbolo, los colores metálicos y rojos y los textos DISTRIBUIDORA DE CARNES JG y CALIDAD QUE SE SIENTE; entregar transparencia real». La transparencia de fondo se comprobó en el canal alfa.

### Carrito y navegación de combos
El menú Combos despliega ocho enlaces a sus secciones individuales y conserva el acceso al catálogo completo. Carnívoro, Junior y Premium tienen ambiente frío; los demás, bruma, pimienta y brasas. Los efectos se pausan con el control global y no alteran la secuencia de La parrilla.
El carrito guarda cantidades localmente, muestra los precios originales y calcula el total sin envío. WhatsApp prepara un mensaje con combos, cantidades, contenido y total; el cliente lo revisa y envía. Los dos números de WhatsApp están configurados en JG_WHATSAPP_NUMBERS, en cart.js, con el código de país. No se extrajeron teléfonos de documentos.
El mini menú muestra TODOS primero (catálogo existente). Cada nombre abre una presentación independiente sin precios en #seleccion-id. Ver contenido y precio abre el detalle original en #combo-id, donde se puede agregar al carrito.
WhatsApp conectado a los dos números comerciales proporcionados expresamente por el usuario: 3003438135 y 3045640932 (Colombia, +57). Tanto el botón de consulta como el carrito permiten elegir el destino; los enlaces incluyen el mensaje preparado. No hay envío automático sin la revisión y acción del cliente en WhatsApp.



Las 18 imágenes están ahora directamente en la raíz, junto a index.html, para facilitar la carga de todos los archivos sin subcarpetas. No hace falta subir dist ni revision-local.

