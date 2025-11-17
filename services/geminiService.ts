import { GoogleGenAI, Type } from "@google/genai";
import type { Listing } from '../types';

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: 'Un nombre descriptivo para la propiedad.' },
      price: { type: Type.NUMBER, description: 'El precio del alquiler, como un número.' },
      description: { type: Type.STRING, description: 'Un breve resumen de la propiedad.' },
      location: { type: Type.STRING, description: 'La ubicación general o ciudad de la propiedad.' },
      contactLink: { type: Type.STRING, description: 'Una URL a un perfil de Instagram o un enlace de WhatsApp.' },
      imageUrls: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Una lista de URLs de las imágenes de la propiedad.'
      },
      comfortFeatures: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Una lista de palabras clave de confort encontradas, como "pileta", "parrilla", "cancha de pádel".'
      },
      proximityToCABA: {
        type: Type.NUMBER,
        description: 'Tiempo estimado de viaje desde CABA en minutos.'
      },
      propertyType: { type: Type.STRING, description: 'El tipo de propiedad, ej. "Casa de campo", "Quinta".' },
      capacity: { type: Type.NUMBER, description: 'La capacidad máxima de personas como un número.' },
      sources: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                site: { type: Type.STRING, description: 'El nombre del sitio web de origen, ej. "Mercado Libre".' },
                url: { type: Type.STRING, description: 'El enlace directo a la publicación en el sitio de origen.' }
            },
            required: ['site', 'url']
        },
        description: 'Una lista de objetos de origen, cada uno con un sitio y una URL.'
      },
      availability: { type: Type.STRING, description: 'El estado de disponibilidad, ej. "Disponible en Enero".' }
    },
    required: ['name', 'price', 'description', 'location', 'imageUrls', 'proximityToCABA', 'comfortFeatures', 'propertyType', 'capacity', 'sources', 'availability']
  }
};


export const processScrapedData = async (scrapedText: string, prompt: string, apiKey: string): Promise<Omit<Listing, 'id' | 'comments' | 'score' | 'scores' | 'isNew'>[]> => {
  if (!apiKey) {
    throw new Error("API Key de Gemini no configurada. Por favor, añádela en la pantalla de Configuración.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  try {
    const fullPrompt = `${prompt}\n\nAquí está el texto extraído:\n\n${scrapedText}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const jsonString = response.text.trim();
    const listings = JSON.parse(jsonString);
    
    if (!Array.isArray(listings)) {
      throw new Error("La respuesta de la API no es un arreglo.");
    }

    // @ts-ignore
    return listings;

  } catch (error) {
    console.error("Error procesando datos con Gemini:", error);
     if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID'))) {
        throw new Error("La API Key de Gemini no es válida. Por favor, revísala en Configuración.");
    }
    throw new Error("No se pudieron procesar los datos. Verifique el texto, la API key y la configuración del prompt.");
  }
};