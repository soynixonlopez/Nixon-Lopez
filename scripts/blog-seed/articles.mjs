/**
 * Contenido oficial de los primeros 3 artículos del blog.
 * Las URLs de imagen se inyectan al momento del seed (Storage bucket `blog`).
 */

function img(src, alt) {
  return `<img src="${src}" alt="${alt}" loading="lazy">`
}

function ctaBlock({ title, text, href = '/cotizacion', label = 'Solicitar cotización' }) {
  return `
<hr>
<h2>${title}</h2>
<p>${text}</p>
<p><a href="${href}"><strong>${label}</strong></a></p>
`.trim()
}

export function article1({ featuredInline, workspaceInline }) {
  return `
<p>Si estás evaluando una <strong>página web en Panamá</strong>, una de las primeras preguntas es inevitable: <strong>¿cuánto cuesta?</strong> La respuesta corta es que depende del tipo de sitio, del alcance y de lo que necesites que haga después del lanzamiento. La respuesta útil es otra: entender rangos reales, qué incluye cada opción y qué conviene para tu negocio ahora.</p>
<p>En este artículo te explico precios orientativos coherentes con los servicios que ofrezco en <a href="/cotizacion">nixonlopez.com</a>, qué diferencia a una landing de un sitio empresarial, y cómo evitar pagar de más por cosas que no necesitas… o pagar de menos por un proyecto que no resuelve el problema.</p>

<h2>¿Cuánto cuesta una página web en Panamá?</h2>
<p>Estos son <strong>precios de referencia desde</strong> (en USD), según el tipo de proyecto. El total final puede variar si agregas funcionalidades, contenido, integraciones o un alcance mayor.</p>
<table>
<thead>
<tr>
<th scope="col">Tipo de proyecto</th>
<th scope="col">Precio orientativo</th>
<th scope="col">Ideal para</th>
</tr>
</thead>
<tbody>
<tr>
<td>Página web profesional / sitio de servicios</td>
<td><strong>Desde $90</strong></td>
<td>Negocios que necesitan presencia clara, servicios y contacto</td>
</tr>
<tr>
<td>Landing page de ventas</td>
<td><strong>Desde $150</strong></td>
<td>Campañas, ofertas puntuales o un solo servicio a convertir</td>
</tr>
<tr>
<td>Sitio con panel administrativo</td>
<td><strong>Desde $150</strong></td>
<td>Cuando quieres actualizar contenido sin depender siempre del desarrollador</td>
</tr>
<tr>
<td>Diseño web con WordPress (servicios)</td>
<td><strong>Desde $200</strong></td>
<td>Sitios administrables con panel familiar</td>
</tr>
<tr>
<td>Tienda online (WordPress / WooCommerce)</td>
<td><strong>Desde $300</strong></td>
<td>Catálogo, carrito y operación de ventas</td>
</tr>
<tr>
<td>Desarrollo web personalizado / sistemas</td>
<td><strong>Según proyecto</strong> (ej. reservas desde $300)</td>
<td>Flujos a medida, paneles, integraciones o lógica de negocio</td>
</tr>
</tbody>
</table>
<p>Si quieres una cifra aplicada a tu caso, lo más rápido es armar una <a href="/cotizacion">cotización online</a> eligiendo el servicio base y los extras que realmente necesitas.</p>
<p>Una nota práctica: estos montos son <strong>puntos de partida del desarrollo</strong>, no una promesa de “todo incluido para siempre”. Si tu negocio necesita copywriting extenso, fotografía profesional, carga de cientos de productos o integraciones especiales, eso se suma al alcance. La transparencia aquí evita frustraciones después.</p>
<p>También ayuda pensar el presupuesto en dos capas: <strong>inversión inicial</strong> (diseño + desarrollo + puesta en marcha) y <strong>operación</strong> (dominio, hosting, cambios, mejoras). Muchas cotizaciones baratas solo cubren la primera capa y dejan la segunda en el aire.</p>
${img(featuredInline, 'Persona trabajando en el diseño de una página web en una laptop')}

<h2>¿Qué tipo de página web necesita tu negocio?</h2>
<p>Antes de comparar presupuestos, define el objetivo. Dos cotizaciones “parecidas” pueden estar resolviendo problemas distintos. Si no sabes qué pedir, es fácil terminar con un sitio “bonito” que no genera consultas.</p>
<p>Hazte tres preguntas simples:</p>
<ul>
<li>¿Qué quiero que haga una persona al llegar a la web? (escribir, llamar, comprar, agendar)</li>
<li>¿Cada cuánto voy a cambiar contenido?</li>
<li>¿Esto es presencia continua o una campaña puntual?</li>
</ul>

<h3>Landing page</h3>
<p>Una landing es una página enfocada en <strong>una acción</strong>: pedir cotización, agendar, comprar un curso, escribir por WhatsApp o registrarse. Suele tener menos navegación y más claridad comercial.</p>
<ul>
<li>Útil para campañas de Meta Ads o Google Ads.</li>
<li>Ideal cuando el mensaje es uno solo y quieres medir conversiones.</li>
<li>En mi catálogo parte <strong>desde $150</strong>.</li>
</ul>
<p>Puedes cotizarla directamente como <a href="/cotizacion?service=landing">landing page</a>.</p>

<h3>Página web empresarial</h3>
<p>Es el sitio “completo” de un negocio de servicios: inicio, servicios, confianza, contacto y, a veces, blog o casos. Su trabajo es generar credibilidad y captar clientes de forma continua, no solo en una promoción.</p>
<ul>
<li>Sirve cuando te buscan por nombre o por servicio.</li>
<li>Debe verse bien en celular (la mayoría del tráfico llega así).</li>
<li>La opción de <a href="/cotizacion?service=web-negocio">página web profesional</a> parte <strong>desde $90</strong>.</li>
</ul>

<h3>Tienda online</h3>
<p>Aquí el sitio no solo informa: <strong>vende</strong>. Necesitas catálogo, carrito, métodos de pago y una forma de administrar productos y pedidos.</p>
<ul>
<li>Tiene más piezas móviles que una web de servicios.</li>
<li>El mantenimiento y la operación pesan más después del lanzamiento.</li>
<li>La tienda en WordPress de mi catálogo parte <strong>desde $300</strong> (<a href="/cotizacion?service=wordpress-tienda-20">cotizar tienda online</a>).</li>
</ul>

<h3>Desarrollo web personalizado</h3>
<p>Cuando el negocio necesita algo que un sitio estándar no resuelve bien: reservas, paneles, flujos internos, integraciones o lógica propia. El precio no se fija “por plantilla”, sino por alcance.</p>
<ul>
<li>Ejemplos típicos: sistemas de reservas, automatizaciones, paneles o apps.</li>
<li>En cotización aparece como <a href="/cotizacion?service=sistema">sistema personalizado</a> o servicios específicos (por ejemplo reservas desde $300).</li>
<li>Aquí vale más una conversación clara del proceso que un precio “cerrado” inventado.</li>
</ul>

<h2>¿Por qué dos páginas web pueden tener precios tan diferentes?</h2>
<p>Porque “página web” es una categoría enorme. Una landing de una sección no es lo mismo que un sitio con 12 páginas, blog, multiidioma, panel y pasarela de pago.</p>
<blockquote>
<p>El precio no debería medirse solo por “cuántas pantallas se ven”, sino por <strong>qué problema resuelve</strong> y qué tan estable queda para operar.</p>
</blockquote>
<p>También influye quién lo hace, con qué tecnología, si incluye contenido, si hay revisiones ilimitadas o un alcance cerrado, y si el proyecto queda listo para SEO técnico básico o solo “se ve bonito”.</p>
<p>Otro factor invisible: la <strong>calidad de la base técnica</strong>. Dos sitios pueden verse similares en una captura de pantalla y, por detrás, uno carga lento, no tiene formularios bien pensados, no está preparado para móvil real o deja el dominio a nombre de terceros. Ese “ahorro” inicial suele aparecer después como costo de reconstrucción.</p>
<p>Por eso, cuando compares propuestas, pide desglose: diseño, desarrollo, contenido, integraciones, revisiones y soporte. Si una oferta no explica eso, no estás comparando el mismo producto.</p>
<p>Si estás evaluando proveedores, te recomiendo leer también <a href="/blog/como-elegir-un-desarrollador-web-en-panama">cómo elegir un desarrollador web en Panamá</a>: ahí detallo qué preguntar antes de firmar.</p>

<h2>¿Qué factores influyen en el precio?</h2>

<h3>Diseño</h3>
<p>Un diseño a medida, con dirección visual clara y buen detalle en móvil, toma más tiempo que adaptar una plantilla genérica. Eso no significa que “plantilla = malo”, pero sí que el nivel de diferenciación cambia el esfuerzo.</p>

<h3>Número de páginas</h3>
<p>Más secciones implica más estructura, más copy, más pruebas y más mantenimiento. Un sitio de 3–5 páginas útiles suele ser más efectivo que uno de 20 páginas vacías.</p>

<h3>Funcionalidades</h3>
<p>Formularios avanzados, galerías, blog, catálogo, reservas, multiidioma o chat con IA aumentan el alcance. En mi configurador, varios extras tienen precios definidos (por ejemplo SEO avanzado, panel, pasarela, etc.), para que veas el impacto antes de decidir.</p>

<h3>Integraciones</h3>
<p>WhatsApp es simple. Conectar pagos, CRMs, calendarios o automatizaciones ya es otro nivel de análisis y pruebas. Cada integración mal hecha se siente después: leads perdidos, dobles reservas, cobros confusos.</p>

<h3>SEO</h3>
<p>Una web profesional debería salir con bases técnicas sanas: títulos, headings, velocidad razonable, estructura clara y buena experiencia móvil. El SEO “avanzado” o de contenido continuo es un trabajo aparte; también puedo cotizar <a href="/cotizacion?service=seo-optimizacion">optimización SEO</a> cuando el sitio ya existe.</p>
<p>Importante: nadie serio debería prometerte “primeros en Google en 7 días”. Lo que sí puedes exigir es una base limpia y un plan realista de mejora.</p>

<h3>Hosting y dominio</h3>
<p>Dominio y hosting suelen ser costos recurrentes (anuales o mensuales), aparte del desarrollo. En algunos proyectos con WordPress el alcance puede incluir configuración inicial de dominio/hosting según lo acordado. Lo importante es que quede claro <strong>quién paga qué</strong> y a nombre de quién queda el dominio.</p>
<p>Recomendación directa: el dominio debería quedar a nombre de tu negocio o de ti. Es un activo. Si mañana cambias de proveedor, no quieres pelear por recuperar tu propia dirección web.</p>
${img(workspaceInline, 'Escritorio de trabajo con laptop y notas para planificar un sitio web')}

<h2>¿Cuánto cuesta mantener una página web?</h2>
<p>El lanzamiento no es el final. Con el tiempo aparecen actualizaciones, cambios de textos, nuevos servicios, ajustes de formularios o correcciones. En mi catálogo hay un servicio de <strong>mantenimiento desde $50</strong> para ajustes sobre sistemas o webs ya creados, según alcance.</p>
<p>Además conviene presupuestar:</p>
<ul>
<li>Dominio y hosting (recurrentes).</li>
<li>Cambios de contenido cuando el negocio evoluciona.</li>
<li>Mejoras de conversión cuando ya tienes tráfico real.</li>
<li>Actualizaciones de seguridad (especialmente si usas WordPress y plugins).</li>
</ul>
<p>Una web abandonada no “se rompe” siempre de golpe: se queda vieja, lenta o desconectada de lo que vendes hoy. Si tu oferta cambió y la web sigue hablando del servicio anterior, estás pagando hosting para confundir clientes.</p>
<p>Un enfoque sano es revisar la web cada cierto tiempo con preguntas de negocio: ¿sigue clara la propuesta? ¿el WhatsApp funciona? ¿las secciones reflejan lo que más vendes hoy? Esa revisión suele rendir más que rediseñar por impulso.</p>

<h2>¿Qué debería incluir una página web profesional?</h2>
<p>Más allá del precio, un sitio útil para un negocio en Panamá suele incluir:</p>
<ul>
<li><strong>Mensaje claro</strong> de a quién ayudas y qué ofreces.</li>
<li><strong>Diseño responsive</strong> (celular primero, sin romperse en desktop).</li>
<li><strong>Contacto fácil</strong>: WhatsApp, formulario o ambos.</li>
<li><strong>Prueba de confianza</strong>: proceso, proyectos, garantías o explicación concreta de cómo trabajas.</li>
<li><strong>Base SEO técnica</strong>: estructura legible para personas y buscadores.</li>
<li><strong>Entrega ordenada</strong>: acceso, dominio y próximos pasos claros.</li>
</ul>
<p>Si quieres ver ejemplos reales de sitios y enfoques, revisa la sección de <a href="/proyectos">proyectos</a>.</p>

<h2>¿Cómo elegir un desarrollador web en Panamá?</h2>
<p>No elijas solo por el precio más bajo. Un proyecto barato que hay que rehacer sale caro. Evalúa portafolio, comunicación, tecnología, ownership del código/dominio y qué pasa después del lanzamiento.</p>
<p>Expandí esta guía completa aquí: <a href="/blog/como-elegir-un-desarrollador-web-en-panama">¿Cómo elegir un desarrollador web en Panamá?</a></p>

<h2>¿Vale la pena invertir en una página web profesional?</h2>
<p>Vale la pena cuando la web tiene un trabajo concreto: atraer consultas, explicar tu oferta, reducir fricción o vender. No vale la pena si la tratas como un “flyer digital” que nadie actualiza y que no conecta con tu operación real (WhatsApp, agenda, ventas, seguimiento).</p>
<p>Para muchos negocios locales, una página bien hecha + un canal claro de contacto supera a un sitio enorme sin foco. La inversión tiene más sentido cuando:</p>
<ol>
<li>Ya atiendes clientes y quieres verse profesional online.</li>
<li>Estás por invertir en anuncios y necesitas una página que convierta.</li>
<li>Tu oferta requiere explicación (servicios, procesos, confianza).</li>
<li>Quieres dejar de depender solo de redes sociales ajenas a tu control.</li>
</ol>
<p>También vale la pena cuando tus clientes te buscan después de una recomendación y quieren “verificar” que eres un negocio serio. En ese momento, la web no compite con Instagram: complementa la confianza.</p>
<p>Si estás entre WordPress y un desarrollo más moderno con React/Next.js, este otro artículo te ayuda a decidir sin fanatismos: <a href="/blog/wordpress-vs-nextjs-cual-es-mejor-para-tu-negocio">WordPress vs Next.js</a>.</p>

<h2>Conclusión</h2>
<p>En 2026, el costo de una página web en Panamá no es un número mágico único. Hay puntos de partida claros —desde <strong>$90</strong> para una web de servicios, <strong>$150</strong> para una landing, <strong>$300</strong> para una tienda— y proyectos a medida que se cotizan según complejidad.</p>
<p>Lo inteligente no es buscar “la más barata”, sino la que resuelve tu objetivo con un alcance honesto. Empieza por el tipo de sitio, define la acción principal y recién ahí discute precio.</p>
<p>Si quieres, armamos esa definición juntos y te entrego una cotización clara, sin rodeos.</p>
${ctaBlock({
  title: '¿Necesitas una página web para tu negocio?',
  text: 'Cuéntame qué vendes, a quién atiendes y qué resultado esperas. Te ayudo a elegir el tipo de sitio correcto y a cotizarlo con claridad.',
  label: 'Ir a cotización',
})}
`.trim()
}

export function article2({ meetingInline, checklistInline }) {
  return `
<p>Contratar un <strong>desarrollador web en Panamá</strong> no debería sentirse como una apuesta. Si ya estás decidido a invertir en una página o un sistema, el siguiente paso es comparar con criterio: portafolio, proceso, tecnología, ownership y soporte.</p>
<p>Esta guía está pensada para dueños de negocio y equipos que no viven en el código, pero sí necesitan una decisión profesional. El objetivo no es “asustarte” con jerga, sino darte una lista práctica para elegir bien.</p>
<p>También sirve si ya te llegaron dos o tres cotizaciones y se sienten imposibles de comparar. Cuando cada propuesta habla un idioma distinto, el checklist de abajo te ayuda a ponerlas en la misma mesa.</p>

<h2>¿Por qué elegir correctamente al desarrollador web es importante?</h2>
<p>Porque el sitio (o el sistema) se convierte en parte de tu operación: captura leads, explica tu oferta, recibe pagos o agenda citas. Una mala elección suele terminar en uno de estos escenarios:</p>
<ul>
<li>Un diseño bonito que no convierte.</li>
<li>Un proyecto que nunca termina de “estar listo”.</li>
<li>Dependencia total del proveedor para cambios mínimos.</li>
<li>Problemas de velocidad, seguridad o indexación.</li>
<li>Rehacer todo a los pocos meses.</li>
</ul>
<p>Elegir bien ahorra dinero, tiempo y frustración. También define si tu presencia digital crece contigo o se queda estancada.</p>
<p>Hay un costo oculto que casi nadie pone en la cotización: el <strong>tiempo de coordinación</strong>. Un proveedor que comunica mal, demora respuestas o cambia el alcance sin aviso te distrae del negocio. Por eso la calidad del proceso importa tanto como la calidad del diseño.</p>
${img(meetingInline, 'Reunión de trabajo para definir un proyecto de desarrollo web')}

<h2>¿Qué deberías revisar antes de contratar?</h2>

<h3>Portafolio</h3>
<p>Pide ejemplos reales y mira más que la estética. Pregúntate:</p>
<ul>
<li>¿Se entiende en 5 segundos a qué se dedica ese negocio?</li>
<li>¿Funciona bien en celular?</li>
<li>¿Hay llamadas a la acción claras?</li>
<li>¿El estilo se parece a lo que tú necesitas, o es siempre el mismo template?</li>
</ul>
<p>Si puedes, abre los sitios en tu propio teléfono y haz la prueba del “cliente apurado”: ¿encuentras cómo contactar en menos de 10 segundos?</p>
<p>En mi caso puedes revisar trabajos y enfoques en <a href="/proyectos">proyectos</a>.</p>

<h3>Experiencia</h3>
<p>No necesitas el “desarrollador más famoso”. Necesitas alguien que haya resuelto problemas parecidos al tuyo: servicios locales, landings de campaña, tiendas, reservas, etc. Pregunta por el tipo de cliente y el tipo de entrega, no solo por años en abstracto.</p>
<p>Una señal positiva es que te haga preguntas de negocio antes de hablar de colores. Si la primera respuesta es “te hago un paquete”, sin entender tu oferta, vas a recibir una plantilla con tu logo.</p>

<h3>Tecnologías</h3>
<p>WordPress, Next.js, React u otras herramientas no son “mejores” por moda. Son mejores cuando encajan con tu operación. Si tu prioridad es administrar contenido con facilidad, no es lo mismo que si necesitas un sistema a medida con integraciones.</p>
<p>Pide la explicación en español claro: qué ganas, qué mantienes y qué limitaciones aceptas. Si no pueden explicarlo sin jerga, va a ser difícil trabajar juntos cuando haya decisiones.</p>
<p>Para una comparación objetiva: <a href="/blog/wordpress-vs-nextjs-cual-es-mejor-para-tu-negocio">WordPress vs Next.js</a>.</p>

<h3>SEO</h3>
<p>Un desarrollador serio debería cuidar bases: títulos, headings, URLs limpias, velocidad razonable, mobile-friendly y estructura clara. El SEO de contenidos y autoridad se construye con el tiempo, pero una base técnica pobre te frena desde el día uno.</p>

<h3>Responsive design</h3>
<p>En Panamá (y en casi cualquier mercado) gran parte del tráfico llega desde el celular. Si el menú se rompe, los botones son pequeños o el texto se corta, estás perdiendo confianza y contactos.</p>

<h3>Velocidad</h3>
<p>Una web lenta se siente poco profesional y castiga la experiencia. No hace falta obsesionarse con un score perfecto de laboratorio; sí hace falta que cargue con fluidez en 4G real y que las imágenes no pesen de más.</p>

<h3>Seguridad</h3>
<p>Formularios protegidos, actualizaciones (sobre todo en WordPress), HTTPS, permisos correctos y backups básicos importan. Pregunta cómo se manejan accesos y qué ocurre si algo falla.</p>

<h2>¿Qué preguntas deberías hacerle a un desarrollador web?</h2>
<p>Lleva estas a la conversación. Las respuestas te dirán más que un presupuesto suelto:</p>
<ul>
<li><strong>¿Qué incluye el proyecto?</strong> Páginas, revisiones, contenido, formularios, capacitación.</li>
<li><strong>¿Quién será dueño del código, del dominio y de las cuentas?</strong> Tú deberías conservar el control.</li>
<li><strong>¿Podré administrar el contenido?</strong> ¿Con panel? ¿Qué tan simple es?</li>
<li><strong>¿El sitio tendrá SEO básico técnico?</strong> ¿Qué queda fuera?</li>
<li><strong>¿Qué tecnología utilizarás y por qué?</strong> Debe haber razón de negocio, no solo preferencia personal.</li>
<li><strong>¿Cuánto cuesta el mantenimiento?</strong> Y qué incluye exactamente.</li>
<li><strong>¿Qué ocurre después del lanzamiento?</strong> Soporte, correcciones, tiempos de respuesta.</li>
<li><strong>¿Cómo se manejan cambios fuera de alcance?</strong> Para evitar malentendidos.</li>
</ul>
<blockquote>
<p>Si alguien evita hablar de ownership, accesos o mantenimiento, anótalo como señal de alerta.</p>
</blockquote>

<h2>¿Freelancer o agencia?</h2>
<p>Ambos pueden funcionar. La diferencia suele estar en proceso, costo y comunicación.</p>
<table>
<thead>
<tr>
<th scope="col">Aspecto</th>
<th scope="col">Freelancer / profesional independiente</th>
<th scope="col">Agencia</th>
</tr>
</thead>
<tbody>
<tr>
<td>Comunicación</td>
<td>Directa con quien ejecuta</td>
<td>Puede haber account + equipo</td>
</tr>
<tr>
<td>Costo típico</td>
<td>Suele ser más ágil y predecible en proyectos medianos</td>
<td>Puede subir por estructura y capas</td>
</tr>
<tr>
<td>Capacidad</td>
<td>Excelente si el alcance está claro</td>
<td>Útil para proyectos grandes o multi-especialidad</td>
</tr>
<tr>
<td>Riesgo</td>
<td>Dependencia de una persona</td>
<td>Dependencia de procesos internos (y a veces rotación)</td>
</tr>
<tr>
<td>Mejor encaje</td>
<td>Webs, landings, tiendas y sistemas con alcance definido</td>
<td>Operaciones grandes, varias marcas o equipos internos</td>
</tr>
</tbody>
</table>
<p>Lo importante no es la etiqueta, sino la claridad del alcance, la calidad de entrega y la responsabilidad después del go-live.</p>
<p>También puedes mezclar enfoques: un profesional independiente para el desarrollo y un aliado de contenidos/ads por separado. Lo que no funciona es tener cinco personas tocando el mismo sitio sin un responsable claro.</p>

<h2>¿Cuánto debería costar contratar un desarrollador web?</h2>
<p>Depende del tipo de proyecto. Como referencia de mi catálogo actual:</p>
<ul>
<li>Página web profesional: <strong>desde $90</strong></li>
<li>Landing page: <strong>desde $150</strong></li>
<li>Tienda online: <strong>desde $300</strong></li>
<li>Desarrollo personalizado: <strong>según proyecto</strong></li>
</ul>
<p>Desglosé rangos, factores y ejemplos aquí: <a href="/blog/cuanto-cuesta-una-pagina-web-en-panama-2026">¿Cuánto cuesta una página web en Panamá en 2026?</a></p>
<p>Desconfía de precios extremadamente bajos sin alcance escrito… y también de presupuestos altos sin entregables claros.</p>
<p>Una forma útil de evaluar precio es convertir la cotización en preguntas: ¿cuántas revisiones incluye? ¿quién escribe los textos? ¿incluye formularios y WhatsApp? ¿queda capacitación? ¿qué pasa si necesito un cambio dos semanas después del lanzamiento? Esas respuestas suelen explicar la diferencia entre “barato” y “completo”.</p>

<h2>Errores comunes al contratar un desarrollador web</h2>
<ol>
<li><strong>Elegir solo por precio.</strong> El rework sale más caro.</li>
<li><strong>No definir objetivo.</strong> “Quiero una web” no es un brief.</li>
<li><strong>No pedir referencias visuales reales.</strong> El portafolio importa.</li>
<li><strong>Olvidar el celular.</strong> Si no se ve bien ahí, el proyecto falla en la práctica.</li>
<li><strong>No aclarar quién administra el contenido.</strong> Luego cada cambio cuesta tiempo y dinero.</li>
<li><strong>No hablar de mantenimiento.</strong> El lanzamiento no es el final.</li>
<li><strong>Entregar el dominio a nombre de terceros sin control.</strong> Protege tus activos digitales.</li>
<li><strong>Empezar sin ejemplos de lo que te gusta.</strong> Sin referencias, el feedback se vuelve eterno.</li>
<li><strong>Pedir “todo” en la versión 1.</strong> A veces conviene lanzar una base sólida y mejorar con datos reales.</li>
</ol>

<h2>¿Necesitas realmente una página web personalizada?</h2>
<p>No siempre. A veces una landing bien hecha resuelve más que un sitio de 15 páginas. Otras veces sí necesitas algo a medida porque tu operación lo exige (reservas, paneles, reglas de negocio).</p>
<p>Una forma simple de decidir:</p>
<ul>
<li><strong>Landing:</strong> una oferta, una campaña, una conversión.</li>
<li><strong>Sitio de servicios:</strong> presencia + confianza + contacto continuo.</li>
<li><strong>Tienda:</strong> vender productos con catálogo y pagos.</li>
<li><strong>Personalizado:</strong> cuando el proceso del negocio no cabe en un sitio estándar.</li>
</ul>
<p>Una señal de que sí necesitas personalización: si hoy operas con hojas de cálculo, chats desordenados y excepciones constantes (“este cliente paga distinto”, “esta reserva requiere aprobación”), un sitio informativo no va a ordenar eso solo. Ahí el desarrollo tiene que modelar el proceso, no solo vestirlo.</p>
<p>Una señal de que NO lo necesitas todavía: si tu prioridad es empezar a recibir consultas con una propuesta clara. En ese caso, una <a href="/cotizacion?service=web-negocio">página web profesional</a> o una <a href="/cotizacion?service=landing">landing</a> suele ser el mejor primer paso.</p>
<p>Si aún no lo tienes claro, empieza por una <a href="/cotizacion">cotización</a> y ajustamos el alcance sin inflar el proyecto.</p>
${img(checklistInline, 'Lista de verificación para evaluar candidatos de desarrollo web')}

<h2>Checklist antes de contratar</h2>
<ul>
<li>☐ Objetivo del sitio definido en una frase</li>
<li>☐ Referencias visuales o ejemplos de sitios que te gustan</li>
<li>☐ Portafolio revisado en celular</li>
<li>☐ Tecnología explicada en lenguaje de negocio</li>
<li>☐ Alcance escrito: páginas, funcionalidades, revisiones</li>
<li>☐ Quién es dueño de dominio, hosting y código</li>
<li>☐ Cómo se administra el contenido después</li>
<li>☐ SEO técnico básico incluido o excluido con claridad</li>
<li>☐ Precio, plazos y forma de pago definidos</li>
<li>☐ Mantenimiento y soporte post-lanzamiento conversados</li>
<li>☐ Contacto / WhatsApp / formularios pensados desde el inicio</li>
<li>☐ Plan de qué se mide como éxito (consultas, ventas, reservas)</li>
</ul>

<h2>Conclusión</h2>
<p>Elegir un desarrollador web en Panamá es menos misterio de lo que parece: mira evidencia, pide claridad y protege tus accesos. Un buen profesional te explica opciones, no te empuja a comprar de más.</p>
<p>Si te quedas con una sola idea de este artículo, que sea esta: <strong>no contrates una promesa estética; contrata un alcance entendible</strong>. El diseño importa, pero el negocio se juega en claridad, ownership y capacidad de operar después del lanzamiento.</p>
<p>Si quieres una segunda opinión sobre tu idea o un presupuesto transparente, puedo ayudarte a bajar el proyecto a un alcance realista.</p>
${ctaBlock({
  title: '¿Tienes un proyecto en mente?',
  text: 'Cuéntame qué quieres construir, en qué punto estás y qué resultado buscas. Te ayudo a definir la solución adecuada.',
})}
`.trim()
}

export function article3({ codeInline, compareInline }) {
  return `
<p><strong>WordPress</strong> y <strong>Next.js</strong> aparecen mucho cuando alguien pregunta qué tecnología usar para su sitio. La discusión se pone rápida en opiniones: “WordPress es viejo”, “Next.js es sobreingeniería”, “React es el futuro”. Ninguna de esas frases ayuda a decidir.</p>
<p>Este artículo compara ambas opciones con criterio de negocio: administración, rendimiento, SEO, costos y mantenimiento. La meta es que termines sabiendo <strong>cuándo conviene cada una</strong>, no cuál “gana” en abstracto.</p>
<p>Si estás armando presupuesto al mismo tiempo, te conviene leer en paralelo <a href="/blog/cuanto-cuesta-una-pagina-web-en-panama-2026">cuánto cuesta una página web en Panamá</a>: tecnología y precio se entienden mejor juntos.</p>

<h2>La respuesta corta</h2>
<p><strong>Depende del proyecto.</strong> WordPress brilla cuando necesitas publicar y administrar contenido con facilidad. Next.js (con React) brilla cuando quieres una experiencia web a medida, alto control técnico y bases sólidas para productos digitales más exigentes.</p>
<blockquote>
<p>La mejor tecnología es la que tu equipo puede operar y la que resuelve el objetivo sin complejidad innecesaria.</p>
</blockquote>
<p>Una regla práctica: si tu problema principal es <strong>publicar y editar</strong>, empieza mirando WordPress. Si tu problema principal es <strong>construir un producto o flujo a medida</strong>, mira Next.js. Hay excepciones, pero esa brújula evita el 80% de decisiones por moda.</p>

<h2>¿Qué es WordPress?</h2>
<p>WordPress es un sistema de gestión de contenidos (CMS). En la práctica, te da un panel de administración donde puedes crear páginas, entradas de blog, menús y —con plugins— tiendas, formularios y más.</p>
<p>Para muchas personas no técnicas, esa es la gran ventaja: <strong>entrar al panel, cambiar un texto y publicar</strong>. También tiene un ecosistema enorme de temas y plugins.</p>
<ul>
<li>Muy usado en blogs y sitios corporativos.</li>
<li>WooCommerce es una ruta común para e-commerce.</li>
<li>Requiere cuidado con actualizaciones, plugins y seguridad.</li>
</ul>
<p>WordPress no es “solo para principiantes”. Hay sitios grandes y complejos sobre esta base. La diferencia está en la disciplina: un WordPress limpio, con pocos plugins bien elegidos, puede ser estable y útil durante años. Un WordPress lleno de atajos suele volverse frágil.</p>

<h2>¿Qué es Next.js?</h2>
<p>Next.js es un framework de JavaScript construido sobre <strong>React</strong>. Sirve para crear sitios y aplicaciones web modernas con buen control de rendimiento, rutas, renderizado y experiencia de usuario.</p>
<p>No es “un WordPress con otra cara”. Suele implicar desarrollo más a medida: el panel de contenido, si existe, se diseña según el proyecto (o se conecta a un CMS headless).</p>
<ul>
<li>Excelente para productos web personalizados.</li>
<li>Muy usado cuando el frontend necesita ser rápido y flexible.</li>
<li>El costo y el valor dependen mucho de un buen desarrollo (no de instalar un tema).</li>
</ul>
<p>En mi propio trabajo uso este enfoque cuando el proyecto necesita precisión: landings de alto rendimiento, experiencias a medida, paneles o integraciones que no deberían depender de una torre de plugins.</p>
${img(codeInline, 'Pantalla con código frontend durante el desarrollo de un sitio web')}

<h2>WordPress vs Next.js: comparación</h2>
<table>
<thead>
<tr>
<th scope="col">Criterio</th>
<th scope="col">WordPress</th>
<th scope="col">Next.js</th>
</tr>
</thead>
<tbody>
<tr>
<td>Facilidad de administración</td>
<td>Alta para contenido típico (páginas/blog)</td>
<td>Alta si se construye un panel/CMS adecuado; si no, más técnica</td>
</tr>
<tr>
<td>Flexibilidad visual/funcional</td>
<td>Alta vía temas/plugins; a veces con límites de calidad</td>
<td>Muy alta a medida; casi todo se puede diseñar a propósito</td>
</tr>
<tr>
<td>Performance</td>
<td>Puede ser buena con buen hosting y optimización; plugins mal elegidos la degradan</td>
<td>Muy sólida cuando el proyecto está bien construido</td>
</tr>
<tr>
<td>SEO técnico</td>
<td>Maduro con buenas prácticas y plugins serios</td>
<td>Excelente control técnico (metadatos, estructura, velocidad)</td>
</tr>
<tr>
<td>Escalabilidad</td>
<td>Buena para contenido; compleja si el sitio se vuelve “Frankenstein” de plugins</td>
<td>Muy buena para productos y sistemas que crecen con reglas claras</td>
</tr>
<tr>
<td>E-commerce</td>
<td>WooCommerce es un camino rápido y conocido</td>
<td>Ideal cuando la tienda/proceso de compra es muy particular</td>
</tr>
<tr>
<td>Contenido</td>
<td>Fortaleza principal (blog, páginas, editores)</td>
<td>Fuerte si se integra CMS o un flujo editorial pensado</td>
</tr>
<tr>
<td>Desarrollo personalizado</td>
<td>Posible, pero a veces pelea con el núcleo/plugins</td>
<td>Diseñado para personalización profunda</td>
</tr>
<tr>
<td>Mantenimiento</td>
<td>Actualizaciones de WP/plugins/temas constantes</td>
<td>Dependencias y deploys; menos “plugin roulette” si el alcance está controlado</td>
</tr>
<tr>
<td>Costos</td>
<td>Puede empezar más accesible; plugins premium y mantenimiento cuentan</td>
<td>El desarrollo inicial puede ser mayor; a cambio ganas control y a medida</td>
</tr>
<tr>
<td>Integraciones</td>
<td>Muchas vía plugins; calidad desigual</td>
<td>Integraciones a medida más limpias cuando el flujo es crítico</td>
</tr>
</tbody>
</table>

<h2>¿Cuándo elegir WordPress?</h2>

<h3>Blogs</h3>
<p>Si el corazón del proyecto es publicar artículos con frecuencia, WordPress sigue siendo una opción natural: editor familiar, categorías, borradores y un flujo editorial simple.</p>

<h3>Sitios empresariales</h3>
<p>Para muchos negocios de servicios, un WordPress bien armado alcanza y sobra: servicios, nosotros, contacto, testimonios y un blog opcional. En mi catálogo hay opciones de <strong>diseño web con WordPress desde $200</strong>.</p>

<h3>Contenido administrable</h3>
<p>Si tu equipo va a cambiar textos, promociones o páginas seguido, y quiere autonomía sin pedir un desarrollo cada vez, WordPress encaja bien.</p>

<h3>E-commerce sencillo</h3>
<p>Para catálogos y ventas estándar, WooCommerce es un camino conocido. Una <a href="/cotizacion?service=wordpress-tienda-20">tienda online</a> en este enfoque parte <strong>desde $300</strong> en mis servicios actuales.</p>
<p>“Sencillo” no significa improvisado: todavía necesitas buenas fichas de producto, métodos de pago claros y un flujo de compra entendible en celular. Pero si tu modelo es catálogo + carrito + pedidos, WordPress suele acortar camino.</p>

<h2>¿Cuándo elegir Next.js?</h2>

<h3>Aplicaciones web</h3>
<p>Cuando no es solo “una web informativa”, sino un producto: flujos, estados, roles, dashboards o experiencias interactivas.</p>
<p>Si el usuario no solo “lee” sino que “opera” dentro del sistema, normalmente necesitas más control del que da un tema de WordPress.</p>

<h3>Sistemas personalizados</h3>
<p>Reservas, paneles internos, lógica de negocio, reglas específicas… aquí Next.js + un backend adecuado suele dar más control que forzar WordPress a comportarse como un software a medida.</p>
<p>Un síntoma clásico de mala elección tecnológica es intentar convertir un CMS de contenidos en un ERP improvisado. Se puede… hasta que duele mantenerlo.</p>

<h3>Dashboards</h3>
<p>Interfaces de administración hechas a propósito para tu operación suelen sentirse más claras cuando se diseñan desde cero, en lugar de pelear con un admin genérico lleno de menús que nadie usa.</p>

<h3>Integraciones</h3>
<p>Si vas a conectar pagos, APIs, automatizaciones o servicios externos de forma crítica, un desarrollo a medida reduce la dependencia de plugins frágiles.</p>
<p>Esto importa especialmente cuando una integración falla: en un sistema a medida puedes aislar y corregir el flujo; en un stack de plugins a veces el diagnóstico es una caja negra.</p>

<h3>Performance</h3>
<p>Cuando la velocidad y la experiencia percibida son parte del producto (no un “nice to have”), Next.js permite un control fino de renderizado, imágenes y carga.</p>
<p>No es magia automática: un Next.js mal hecho también puede ser lento. La ventaja es el techo de control técnico cuando el proyecto lo requiere.</p>
${img(compareInline, 'Comparación visual de enfoques tecnológicos para un proyecto web')}

<h2>Mitos comunes (y cómo mirarlos con calma)</h2>
<p><strong>“WordPress no posiciona.”</strong> Falso como regla general. Hay sitios WordPress que posicionan bien cuando la base técnica y el contenido están cuidados. El CMS no sustituye la estrategia, pero tampoco la impide por defecto.</p>
<p><strong>“Next.js es solo para startups.”</strong> Tampoco. Un negocio local puede beneficiarse de una landing o un sistema a medida si el caso lo justifica. La pregunta no es el tamaño de la empresa, sino la naturaleza del problema.</p>
<p><strong>“Con plugins resuelvo cualquier cosa.”</strong> A veces sí, a corto plazo. El riesgo es acumular dependencias que nadie entiende y que se rompen juntas en una actualización.</p>
<p><strong>“Si es personalizado, siempre es más caro e innecesario.”</strong> Personalizado cuesta más cuando el alcance es mayor; también puede ahorrar dinero si evita pelear durante meses con herramientas que no encajan.</p>
<p>La forma adulta de decidir es simple: lista restricciones reales (quién edita, presupuesto, plazo, integraciones críticas) y elige la opción que las respete con menos fricción.</p>

<h2>¿Y qué pasa con WordPress Headless?</h2>
<p><strong>Headless</strong> significa usar WordPress solo como CMS (para editar contenido) y mostrar ese contenido en un frontend moderno, por ejemplo con Next.js.</p>
<p>Es una opción intermedia interesante:</p>
<ul>
<li>El equipo editorial sigue en WordPress.</li>
<li>La experiencia pública se construye con más control técnico.</li>
<li>Añade complejidad: dos piezas que mantener (CMS + frontend).</li>
</ul>
<p>Vale la pena cuando el contenido es intenso <em>y</em> la experiencia/performance importan mucho. Para un sitio pequeño, a veces es más de lo necesario.</p>
<p>Si te proponen headless, pregunta por el beneficio concreto: ¿quién edita?, ¿cada cuánto?, ¿qué mejora el usuario final? Si la respuesta es solo “está de moda”, probablemente no lo necesitas todavía.</p>

<h2>¿Qué tecnología elegiría para diferentes tipos de proyectos?</h2>
<table>
<thead>
<tr>
<th scope="col">Tipo de proyecto</th>
<th scope="col">Opción razonable</th>
<th scope="col">Por qué</th>
</tr>
</thead>
<tbody>
<tr>
<td>Landing de campaña</td>
<td>Next.js o web a medida liviana / también WP si el equipo ya vive ahí</td>
<td>Prioridad: velocidad de carga y conversión</td>
</tr>
<tr>
<td>Sitio empresarial de servicios</td>
<td>WordPress o sitio profesional a medida</td>
<td>Depende de cuánto contenido se edita y del nivel de personalización</td>
</tr>
<tr>
<td>Blog con publicación frecuente</td>
<td>WordPress (o headless si hay requisitos altos)</td>
<td>Flujo editorial maduro</td>
</tr>
<tr>
<td>Tienda online estándar</td>
<td>WordPress + WooCommerce</td>
<td>Camino conocido para catálogo y pedidos</td>
</tr>
<tr>
<td>Sistema de reservas</td>
<td>Desarrollo personalizado (p. ej. con Next.js)</td>
<td>Reglas de negocio y operación importan más que un tema</td>
</tr>
<tr>
<td>Aplicación web / panel</td>
<td>Next.js + React</td>
<td>Control de UX, estados e integraciones</td>
</tr>
</tbody>
</table>
<p>Si quieres ver cómo se ven proyectos reales en distintos contextos, visita <a href="/proyectos">proyectos</a>. Y si estás dimensionando presupuesto, este artículo te da rangos actuales: <a href="/blog/cuanto-cuesta-una-pagina-web-en-panama-2026">cuánto cuesta una página web en Panamá en 2026</a>.</p>
<p>También puedes usar esta pregunta para desempatar: <strong>¿qué preferirías romper primero, la facilidad de edición o la libertad de producto?</strong> Si romper la edición duele más, inclínate a WordPress (o a un CMS claro). Si romper la flexibilidad del producto duele más, inclínate a Next.js.</p>
<p>Ejemplo concreto: un consultor que publica dos artículos al mes y quiere editar servicios con autonomía normalmente estará mejor con WordPress o un sitio con panel simple. Una clínica que necesita agenda, reglas de disponibilidad y confirmaciones probablemente necesite un desarrollo más a medida —aunque también tenga una web pública de presentación.</p>
<p>Otro ejemplo: una marca que vende 25 productos con variaciones puede avanzar rápido con WooCommerce. Un marketplace con comisiones, roles de vendedores y lógica propia ya no es “una tienda con tema”: es producto.</p>
<p>Y si todavía estás eligiendo proveedor además de tecnología, esta guía te ordena la conversación: <a href="/blog/como-elegir-un-desarrollador-web-en-panama">cómo elegir un desarrollador web en Panamá</a>.</p>

<h2>Conclusión</h2>
<p>WordPress no está “obsoleto”. Next.js no es automáticamente “mejor”. Son herramientas distintas:</p>
<ul>
<li><strong>Elige WordPress</strong> cuando la autonomía editorial y un ecosistema CMS te dan velocidad de negocio.</li>
<li><strong>Elige Next.js</strong> cuando el producto digital necesita precisión, performance y personalización profunda.</li>
</ul>
<p>La decisión correcta empieza por tu operación: quién publica, qué tan crítico es el flujo, y qué vas a mantener en 6–12 meses.</p>
<p>Si eliges bien, la tecnología se siente invisible: tu cliente encuentra lo que necesita, tu equipo puede operar sin fricción y tú no vives apagando incendios técnicos. Si eliges mal, la tecnología se vuelve el tema de cada reunión. Por eso esta decisión merece 30 minutos de claridad, no una apuesta por la herramienta del momento.</p>
<p>Si quieres una recomendación aplicada a tu caso —sin discurso técnico innecesario—, cuéntame el objetivo del proyecto y te digo qué camino tiene más sentido hoy.</p>
${ctaBlock({
  title: '¿No sabes qué tecnología necesita tu proyecto?',
  text: 'Cuéntame tu idea y te recomiendo un camino realista —sin venderte complejidad que no necesitas.',
  label: 'Solicitar cotización',
})}
`.trim()
}

export const ARTICLES_META = [
  {
    key: 'a1',
    title: '¿Cuánto cuesta una página web en Panamá en 2026?',
    slug: 'cuanto-cuesta-una-pagina-web-en-panama-2026',
    category: 'Desarrollo Web',
    tags: ['Panamá', 'desarrollo web', 'páginas web', 'diseño web', 'precios', 'SEO'],
    excerpt:
      'Precios orientativos reales para landing, sitio empresarial, tienda online y desarrollo personalizado en Panamá, con factores que mueven el presupuesto.',
    seo_title: '¿Cuánto cuesta una página web en Panamá en 2026?',
    seo_description:
      'Conoce cuánto cuesta una página web en Panamá en 2026, qué factores influyen en el precio y qué tipo de sitio necesita realmente tu negocio.',
    featured_alt: 'Desarrollo de una página web profesional para un negocio',
    author_name: 'Nixon Lopez',
    published_at: '2026-08-08T18:00:00.000Z',
    images: {
      featured:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
      inline1:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80',
      inline2:
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80',
    },
    imageOrigins: {
      featured: 'Unsplash — photo-1460925895917-afdab827c52f (laptop / analytics)',
      inline1: 'Unsplash — photo-1498050108023-c5249f4df085 (código en laptop)',
      inline2: 'Unsplash — photo-1454165804606-c3d57bc86b40 (planificación de negocio)',
    },
  },
  {
    key: 'a2',
    title: '¿Cómo elegir un desarrollador web en Panamá?',
    slug: 'como-elegir-un-desarrollador-web-en-panama',
    category: 'Desarrollo Web',
    tags: ['Panamá', 'desarrollador web', 'desarrollo web', 'páginas web', 'negocios', 'tecnología'],
    excerpt:
      'Qué revisar antes de contratar: portafolio, tecnología, SEO, preguntas clave, freelancer vs agencia y una checklist práctica.',
    seo_title: '¿Cómo elegir un desarrollador web en Panamá?',
    seo_description:
      'Descubre qué debes revisar antes de contratar un desarrollador web en Panamá, qué preguntas hacer y cómo elegir la solución adecuada para tu negocio.',
    featured_alt: 'Equipo revisando opciones para contratar un desarrollador web',
    author_name: 'Nixon Lopez',
    published_at: '2026-08-08T16:00:00.000Z',
    images: {
      featured:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80',
      inline1:
        'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=80',
      inline2:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
    },
    imageOrigins: {
      featured: 'Unsplash — photo-1522071820081-009f0129c71c (colaboración de equipo)',
      inline1: 'Unsplash — photo-1600880292203-757bb62b4baf (reunión profesional)',
      inline2: 'Unsplash — photo-1552664730-d307ca884978 (planificación en pizarra)',
    },
  },
  {
    key: 'a3',
    title: 'WordPress vs Next.js: ¿cuál es mejor para tu negocio?',
    slug: 'wordpress-vs-nextjs-cual-es-mejor-para-tu-negocio',
    category: 'Tecnología',
    tags: ['WordPress', 'Next.js', 'React', 'desarrollo web', 'SEO', 'Panamá'],
    excerpt:
      'Comparación objetiva de WordPress y Next.js: administración, performance, SEO, e-commerce y cuándo elegir cada tecnología.',
    seo_title: 'WordPress vs Next.js: ¿Cuál es mejor para tu negocio?',
    seo_description:
      'WordPress vs Next.js: descubre las diferencias en rendimiento, SEO, escalabilidad, administración y cuándo conviene utilizar cada tecnología.',
    featured_alt: 'Desarrollo frontend con tecnologías web modernas',
    author_name: 'Nixon Lopez',
    published_at: '2026-08-08T14:00:00.000Z',
    images: {
      featured:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80',
      inline1:
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80',
      inline2:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80',
    },
    imageOrigins: {
      featured: 'Unsplash — photo-1555066931-4365d14bab8c (código en editor)',
      inline1: 'Unsplash — photo-1517694712202-14dd9538aa97 (laptop con código)',
      inline2: 'Unsplash — photo-1516321318423-f06f85e504b3 (trabajo digital / aprendizaje)',
    },
  },
]
