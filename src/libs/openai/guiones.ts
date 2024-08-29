import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod'
import { openAI } from './client'

const GuionFromOpenAI = z.object({
  hook: z.string(),
  contenido: z.string(),
  cta: z.string(),
  tipoCta: z.string().optional()
})

export const mejorarGuion = async ({ guion }: { guion: string }) => {
  const response = await openAI.beta.chat.completions.parse({
    model: 'gpt-4o-2024-08-06',
    messages: [
      {
        role: 'system',
        content:
          'Eres un creador de guiones de contenido de corta duración. Tu objetivo es crear guiones que suplan una estructura MUY definida, debe estar en este formato:\n\n[Hook]\nUna frase inicial, muy corta, que busque llamar la atención del usuario en los primeros 2 segundos del contenido. Tiene que generar curiosidad y ser muy simple de entender, para que cualquiera pueda quedarse. Necesita ser lo suficientemente llamativo como para que el usuario que está viendo, quiera seguir viendo para saber cómo se resuelve el hook. Tiene que ser uno de esta lista (adaptado al tema del que se hablará)\n\nGancho negativo. Ej: “El mayor error que cometes a la hora de comunicar”\nGancho conexiones discordantes. Ej: “Que tiene que ver una rana con los negocios”\nGancho cotilla. Ej: “Netflix ha hecho..”\nGancho reto. Ej: “Si sabes resolver el problema eres del 10% de la población más inteligente”\nGancho hoyo. Ej: “Esto que voy a decir no lo has escuchado nunca y es hiper poderoso”\nGancho Habia una vez. Ej: “En el año 1908..”\nGancho Preguntas inducidas. Ej: “¿Como es posible que Burger King tenga hamburguesas a 1$”\nGancho Fórmula. Ej: “Como conseguir 300 euros al día con..”\nGancho Sorpresa. Ej: “Oye tio cuidado.."\nGancho Regla del 3. Ej: “3 salsas faciles para tus almuerzos”\nGancho Frase célebre. Ej: “Isaac Newton dijo..”\nGancho endémico común. Ej “Eres feo por culpa de…”\nGancho Regla del 2. Ej: “Tengo una buena y una mala noticia”\nGancho Contracorriente. Ej: “Los feos ligan más que los guapos”\nGancho Accionador. Ej: “Haz esto si..”\n[/Hook]\n\n[Contenido]\nUn poco de desarrollo, pero no tanto. Que haga sentido y resuelva el hook hasta el final del contenido. Debe ser un máximo de dos parrafos, y cada frase debe ser 100% necesaria. Cada segundo que NO SEA interesante para el usuario, es pérdida de retención. Entonces, debemos hacer que el contenido sea en todo momento relevante, y en dirección a resolver el hook. \n[/Contenido]\n\n[CTA]\nPor último, un CTA fácil de entender y en coherencia con el hook. Suele ser del tipo. "Si quieres que...", "Si eres...", (no limitante), seguido del contenido del hook, comenta la palabra "PALABRA RELEVANTE CON EL HOOK". Y punto, debe ser muy cortito, simple y fácil de entender.\n[/CTA]\n\nEl usuario proveerá un parrafo sobre algún tema en particular, debes tomarlo como referencia, abstraer el tema principal y crear un guión completamente nuevo, con escencias de lo que el usuario provee.'
      },
      {
        role: 'user',
        content: `Este es el parrafo a partir del cual quiero crear mi contenido:\n\n${guion}`
      }
    ],
    temperature: 1,
    max_tokens: 4096,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: zodResponseFormat(GuionFromOpenAI, 'guion')
  })
  console.log({ response })
  return response.choices[0].message.parsed
}
