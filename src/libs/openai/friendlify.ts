import { openAI } from './client'

export const friendlifyText = async ({ text }: { text: string }) => {
  const response = await openAI.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You will be provided with a text, you have to make it more friendly and digestible, make it more interesting and engaging. It has to be able to be read and understood by a 12 year old as well as a 60 year old. The text is thought to be part of a script for a social media video, so make it engaging and interesting. If the text is in any other language than spanish, also translate it to spanish and give me that text as the response. Solo dame el texto traducido al español como respuesta.`
      },
      {
        role: 'user',
        content: text
      }
    ]
  })
  return response.choices[0].message.content
}

export const improveWithAI = async ({ text }: { text: string }) => {
  const response = await openAI.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'Eres un creador de guiones de contenido de corta duración. Tu objetivo es crear guiones que suplan una estructura MUY definida, debe estar en este formato:\n\n[Hook]\nUna frase inicial, muy corta, que busque llamar la atención del usuario en los primeros 2 segundos del contenido. Tiene que generar curiosidad y ser muy simple de entender, para que cualquiera pueda quedarse. Necesita ser lo suficientemente llamativo como para que el usuario que está viendo, quiera seguir viendo para saber cómo se resuelve el hook. Tiene que ser uno de esta lista (adaptado al tema del que se hablará)\n\nGancho negativo. Ej: “El mayor error que cometes a la hora de comunicar”\nGancho conexiones discordantes. Ej: “Que tiene que ver una rana con los negocios”\nGancho cotilla. Ej: “Netflix ha hecho..”\nGancho reto. Ej: “Si sabes resolver el problema eres del 10% de la población más inteligente”\nGancho hoyo. Ej: “Esto que voy a decir no lo has escuchado nunca y es hiper poderoso”\nGancho Habia una vez. Ej: “En el año 1908..”\nGancho Preguntas inducidas. Ej: “¿Como es posible que Burger King tenga hamburguesas a 1$”\nGancho Fórmula. Ej: “Como conseguir 300 euros al día con..”\nGancho Sorpresa. Ej: “Oye tio cuidado.."\nGancho Regla del 3. Ej: “3 salsas faciles para tus almuerzos”\nGancho Frase célebre. Ej: “Isaac Newton dijo..”\nGancho endémico común. Ej “Eres feo por culpa de…”\nGancho Regla del 2. Ej: “Tengo una buena y una mala noticia”\nGancho Contracorriente. Ej: “Los feos ligan más que los guapos”\nGancho Accionador. Ej: “Haz esto si..”\n[/Hook]\n\n[Contenido]\nUn poco de desarrollo, pero no tanto. Que haga sentido y resuelva el hook hasta el final del contenido. Debe ser un máximo de dos parrafos, y cada frase debe ser 100% necesaria. Cada segundo que NO SEA interesante para el usuario, es pérdida de retención. Entonces, debemos hacer que el contenido sea en todo momento relevante, y en dirección a resolver el hook. \n[/Contenido]\n\n[CTA]\nPor último, un CTA fácil de entender y en coherencia con el hook. Suele ser del tipo. "Si quieres que...", "Si eres...", (no limitante), seguido del contenido del hook, comenta la palabra "PALABRA RELEVANTE CON EL HOOK". Y punto, debe ser muy cortito, simple y fácil de entender.\n[/CTA]\n\nEl usuario proveerá un parrafo sobre algún tema en particular, debes tomarlo como referencia, abstraer el tema principal y crear un guión completamente nuevo, con escencias de lo que el usuario provee.'
      },
      {
        role: 'user',
        content: `Este es el parrafo a partir del cual quiero crear mi contenido:\n\n${text}`
      }
    ],
    temperature: 1,
    max_tokens: 4096,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: {
      type: 'text'
    }
  })
  return response.choices[0].message.content
}
