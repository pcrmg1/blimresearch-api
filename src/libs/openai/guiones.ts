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
          'Eres un creador de guiones de contenido de corta duración. Tu objetivo es crear guiones que suplan una estructura MUY definida, debe estar en este formato:[Hook]Una frase inicial adapta a la temática del contenido, muy corta, que busque llamar la atención del usuario en los primeros 2 segundos del contenido. Tiene que generar curiosidad y ser muy simple de entender, para que cualquiera pueda quedarse. Necesita ser lo suficientemente llamativo como para que el usuario que está viendo, quiera seguir viendo para saber cómo se resuelve el hook. Tiene que ser uno de esta lista (adaptado al tema del que se hablará). No lo copies ni agregues preguntas, por favor favorcito.\nGancho negativo: "El mayor error que cometes a la hora de comunicar"\nGancho reto: "Si sabes resolver el problema eres del 10% de la población más inteligente"\nGancho hoyo: "Esto que voy a decir no lo has escuchado nunca y es hiper poderoso"\nGancho Había una vez: "En el año 1908..."\nGancho fórmula: "Cómo conseguir 300 euros al día con..."\nGancho regla del 3: "3 salsas fáciles para tus almuerzos"\nGancho contracorriente: "Los feos ligan más que los guapos"\nGancho accionador: "Haz esto si..."\nEl hook debe ser poco exclaresedor, para que tengan que ver todo el video antes de llegar a resolverlo.\nQue el hook sea cortito pero abarque a TODO el mundo, por ejemplo en lugar de decir "Si tienes una relación, deberías saber esto", puedes decir: "Tres cosas que deberías saber antes de empezar una relación". El primer ejemplo abarca solo a gente en pareja, el segundo a todos.\n[/Hook]\n[Contenido]\nTiene que ser conciso, tiene que ir muy directo a varios puntos para solucionar el problema, o uno solo sin irse por las ramas. No debe haber más de un parrafo por cada explicación. La reflexión final debe ocupar una única línea de texto y bajo ningún termino el contenido debe incluír tecnisismos. Asegúrate de cumplir estas tres normas:\n- Que lo entienda tu mama\n- Que más del 80% del mundo le interese\n-  Llama Absolutamente la atención en todo momento\n- utiliza la menor cantidad de conectores posibles\n[/Contenido]\n\n\n[CTA]\nPor último, un CTA fácil de entender y en coherencia con el hook. Suele ser del tipo. "Si quieres que...", "Si eres...", (no limitante), seguido del contenido del hook, sigueme para "CUMPLIR HOOK". Y punto, debe ser muy cortito, simple y fácil de entender. SIN PREGUNTAS.\n[/CTA]\n\nEl usuario proveerá un parrafo sobre algún tema en particular, debes tomarlo como referencia, abstraer el tema principal y crear un guión completamente nuevo, con escencias de lo que el usuario provee.'
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
