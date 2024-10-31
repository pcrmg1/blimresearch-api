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
        content: `Eres un creador de guiones de contenido de corta duración. Tu objetivo es crear guiones que suplan una estructura MUY definida, debe estar en este formato:

[Hook]
Una frase inicial adapta a la temática del contenido, muy corta, que cree una expectativa del guión sin darle la respuesta ni tampoco mencionar de qué hablará. Tiene que generar curiosidad y ser muy simple de entender, para que cualquiera pueda quedarse. Necesita ser lo suficientemente llamativo como para que el usuario que está viendo, quiera seguir viendo para saber cómo se resuelve el hook. Tiene que ser uno de esta lista (adaptado al tema del que se hablará)
No lo copies ni agregues preguntas, por favor favorcito.

Gancho negativo: Ej. "Nunca hagas X si quieres Y". Ej: "El mayor error que cometes al X"
Gancho reto:  Ej. "Si sabes X, eres del Y% ... Z". 
Gancho hoyo: Genera expectativa, hype. Por ej. "Esto que voy a decir no lo has escuchado nunca".
Gancho Había una vez: Ej. "En el año X...", Ej. "Hace X años..."
Gancho fórmula: Ej "Cómo X en Y tiempo con Z", Ej "Cómo X, en Y tiempo.."
Gancho regla del 3: Ej. "3 X para Z"
Gancho contracorriente: "Los X  más que los -X". Ej: Los feos ligan más que los guapos.
Gancho accionador "Haz esto si X"... genera expectativa.

El hook debe ser poco exclaresedor, para que tengan que ver todo el video antes de llegar a resolverlo. 
Que el hook sea cortito pero abarque a TODO el mundo, por ejemplo en lugar de decir "Si tienes una relación, deberías saber esto", puedes decir: "Tres cosas que deberías saber antes de empezar una relación". El primer ejemplo abarca solo a gente en pareja, el segundo a todos. 
[/Hook]

[Contenido]
Tiene que ser conciso, tiene que ir muy directo a varios puntos para solucionar el problema, o uno solo sin irse por las ramas. No debe haber más de un parrafo por cada explicación. La reflexión final debe ocupar una única línea de texto y bajo ningún termino el contenido debe incluír tecnisismos. Asegúrate de cumplir estas tres normas: 

- Que lo entienda tu mama
- Que más del 80% del mundo le interese
-  Llama Absolutamente la atención en todo momento
- utiliza la menor cantidad de conectores posibles
[/Contenido]

\n\n[CTA]\nPor último, un CTA fácil de entender y en coherencia con el hook. Suele ser del tipo. \"Si quieres que...\", \"Si eres...\", (no limitante), seguido del contenido del hook, sigueme para \"CUMPLIR HOOK\". Y punto, debe ser muy cortito, simple y fácil de entender. SIN PREGUNTAS.\n[/CTA]\n\n

El usuario proveerá un parrafo sobre algún tema en particular, debes tomarlo como referencia, abstraer el tema principal y crear un guión completamente nuevo, con escencias de lo que el usuario provee.`
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
  return response.choices[0].message.parsed
}

export const mejorarGuionPorPartes = async ({
  text,
  mejorar,
  contenidoAMejorar,
  recomendaciones
}: {
  text: string
  mejorar: ['hook' | 'contenido' | 'cta']
  contenidoAMejorar: string
  recomendaciones?: string
}) => {
  const response = await openAI.beta.chat.completions.parse({
    model: 'gpt-4o-2024-08-06',
    messages: [
      {
        role: 'system',
        content:
          'Eres una maquina superinteligente que mejora los contenidos de una red social, teniendo en cuenta que los contenidos tienen siempre un hook, contenido y un call to action. Tu objetivo en este caso es mejorar alguna de esas 3 partes, teniendo en cuenta el texto que se te provee. Debes mejorar el contenido que se te provee, teniendo en cuenta que el contenido debe ser relevante, interesante y que resuelva el hook.'
      },
      {
        role: 'user',
        content: `Este es el texto a partir del cual se creo:\n${text}\n. Solo quiero que mejores el ${mejorar}, que es el siguiente:\n${contenidoAMejorar}.${
          recomendaciones &&
          `\nRecomendaciones a tener en cuenta para la mejora: ${recomendaciones}`
        }`
      }
    ],
    temperature: 1,
    max_tokens: 4096,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: zodResponseFormat(
      z.object({
        text: z.string(),
        mejora: z.string()
      }),
      'guion'
    )
  })
  return response.choices[0].message.parsed
}

export const generarCategoriaConTranscripcion = async ({
  transcripcion
}: {
  transcripcion: string
}) => {
  const response = await openAI.chat.completions.create({
    model: 'gpt-4o-2024-05-13',
    messages: [
      {
        role: 'system',
        content: [
          {
            type: 'text',
            text: 'Categoriza el guión que el usuario provee, entre estas posibles categorías: \n\nStorytelling\nPaso a Paso\nPreguntas (Empieza por pregunta)\nControversial\nTutorial Express\nInspiracional / Motivacional\nOpinión Personal\nDato Curioso / Cultura General\nActualidad / Noticias\nAnálisis / Revisión (Review)\nExperiencia Personal\nConsejos o Tips\nFAQ (Preguntas Frecuentes)\nComparativa\nReflexión o Filosofía Personal\nOtro\n\nUtiliza tu proprio criterio. Solo puedes responder con UNA SOLA categoría. '
          }
        ]
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `[Guion] ${transcripcion} [/Guion]`
          }
        ]
      }
    ],
    temperature: 1,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: {
      type: 'text'
    }
  })
  return response.choices[0].message.content
}
