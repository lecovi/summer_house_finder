import type { Settings } from './types';

export const DEFAULT_PROMPT = `Analiza el siguiente texto extraído de un sitio web de bienes raíces. Extrae todos los listados de propiedades que coincidan con estos criterios: casa de campo, estancia o quinta para un mínimo de 8 personas con pileta y parrilla, ubicada a menos de 2 horas de CABA.

Para cada listado válido, extrae:
- un nombre descriptivo
- el precio del alquiler como un número (sin símbolos ni texto)
- una breve descripción
- la ubicación general
- un enlace de contacto (WhatsApp o Instagram si está disponible)
- hasta 5 URL de imágenes
- características clave de confort como "asador", "cancha de pádel", etc.
- un tiempo de viaje estimado desde CABA en minutos (por ejemplo, 90 para 1.5 horas)
- el tipo de propiedad (ej. "Casa de campo", "Quinta", "Estancia")
- la capacidad máxima de personas como un número
- una lista de fuentes, donde cada fuente es un objeto con "site" (ej. "Mercado Libre", "Zonaprop", "Airbnb") y "url" (el enlace directo al anuncio)
- el estado de disponibilidad (ej. "Disponible en Enero", "Consultar fechas")

Devuelve los resultados como un arreglo JSON.`;

export const DEFAULT_SETTINGS: Settings = {
  weights: {
    price: 35,
    comfort: 40,
    proximity: 25,
  },
  prompt: DEFAULT_PROMPT,
  apiKey: '',
  sites: [
    'https://inmuebles.mercadolibre.com.ar/quintas/alquiler/temporal/bsas-gba-norte/',
    'https://www.zonaprop.com.ar/quintas-alquiler-temporal-gba-norte.html',
  ],
};

export const COMMON_AMENITIES = ['pileta', 'parrilla', 'asador', 'cancha de pádel', 'wifi', 'aire acondicionado', 'metegol', 'ping pong', 'quincho', 'parque', 'cancha de futbol', 'hogar a leña'];


export const MOCK_SCRAPED_DATA = `
<article class="zonaprop-listing">
  <h2>Espectacular Quinta en Pilar con Pileta Climatizada</h2>
  <p>Precio: $260000 ARS por semana</p>
  <p>Ubicación: Pilar, a 60 minutos de CABA</p>
  <p>Disponibilidad: Fines de semana de Diciembre</p>
  <div class="description">
    Disfruta de esta increíble casa de campo para 12 personas. Cuenta con 4 habitaciones, pileta climatizada, parrilla, y un gran parque. Ideal para familias. No te pierdas la cancha de pádel profesional.
  </div>
  <div class="images">
    <img src="https://images.pexels.com/photos/221540/pexels-photo-221540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
    <img src="https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
  </div>
  <a href="https://www.zonaprop.com.ar/pilar-quinta-123">Ver en Zonaprop</a>
  <a href="https://wa.me/5491112345678">Contactar por WhatsApp</a>
</article>

<div class="mercadolibre-item">
  <h3>Alquiler Temporario Estancia de Lujo en Cañuelas</h3>
  <span class="price">$450000</span>
  <p>Descripción: Una estancia única para hasta 15 huéspedes. A solo 90 minutos de la capital. Ofrece pileta, quincho con parrilla y asador, y cancha de fútbol. Capacidad para 16 personas. Tipo: Estancia.</p>
  <p>Disponibilidad: Enero y Febrero 2025</p>
  <img src="https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
  <a href="https://inmuebles.mercadolibre.com.ar/estancia-canuelas-456">Ver en Mercado Libre</a>
  <p>Contacto: en Instagram @EstanciaCanuelas</p>
</div>

<div class="airbnb-card">
  <h4>Casa de campo moderna - Luján</h4>
  <p>A 75 min de CABA. Capacidad: 8 personas. Con pileta y parrilla. No tiene lujos pero es muy cómoda. No se aceptan mascotas.</p>
  <p>Valor: 180.000 pesos la semana</p>
  <p>Disponibilidad: Consultar</p>
  <img src="https://images.pexels.com/photos/259600/pexels-photo-259600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
  <img src="https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
  <a href="https://www.airbnb.com/rooms/789">Ver en Airbnb</a>
  <img src="https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
</div>

<div class="bad-listing">
  <p>Departamento en CABA para 2 personas. No tiene pileta.</p>
</div>

<div class="another-source-for-pilar">
  <h3>Quinta en Pilar, ideal descanso - 12 personas</h3>
  <span>$280.000 / semana</span>
  <p>La misma de Zonaprop, ahora en Mercado Libre. Pileta, pádel, todo.</p>
  <p>Disponible Dic.</p>
  <a href="https://inmuebles.mercadolibre.com.ar/pilar-quinta-123-alt">Ver en Mercado Libre</a>
</div>
`;