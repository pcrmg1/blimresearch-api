import { string } from 'zod'
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
    model: 'gpt-4o-2024-08-06',
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

export const improveContenido = async ({
  hook,
  contenido,
  cta
}: {
  hook: string
  contenido: string
  cta: string
}) => {
  const response = await openAI.chat.completions.create({
    model: 'gpt-4o-2024-08-06',
    messages: [
      {
        role: 'system',
        content: [
          {
            type: 'text',
            text: 'Reescribe únicamente el CONTENIDO de este guión, teniendo en cuenta los parametros. Cada frase debe aportar valor, eliminando lo innecesario. Un contenido efectivo se enfoca en mantener al usuario interesado desde el primer segundo hasta el último. Debe haber un desarrollo claro, pero sin extenderse en detalles irrelevantes. Todo lo que no sirva para resolver el hook principal resta retención. Dos párrafos como máximo, donde cada palabra tenga un propósito claro: guiar al lector hacia la resolución. El interés se pierde cuando el contenido deja de ser útil o entretenido. Mantén la atención del usuario llevando cada oración en dirección a la respuesta. La resolución del hook debe estar SIEMPRE AL FINAL del contenido, para mantener a la audiencia a la espectativa y espera de resolverlo, para que llegue al final.\nSolo retorna el CONTENIDO NUEVO reescrito y seguro de que cumple lo mencionado. El final debe responder EXPLICITAMENTE al hook.'
          }
        ]
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `'[Hook]  \n${hook}\n[/Hook]\n\n[Contenido]\n${contenido}\n[/Contenido]\n\n[CTA]\n${cta}\n[/CTA]'`
          }
        ]
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

export const improveHook = async ({
  contenido,
  cta
}: {
  contenido: string
  cta: string
}) => {
  const response = await openAI.chat.completions.create({
    model: 'ft:gpt-4o-2024-08-06:settersoft::AIJ7jyAI',
    messages: [
      {
        role: 'system',
        content: [
          {
            type: 'text',
            text: 'You are a creator of hooks for video scripts.'
          }
        ]
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Contenido: ${contenido}\nCta: ${cta}`
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

export const improveCTASeguidores = async ({
  hook,
  contenido,
  cta
}: {
  hook: string
  contenido: string
  cta: string
}) => {
  const response = await openAI.chat.completions.create({
    model: 'gpt-4o-2024-08-06',
    messages: [
      {
        role: 'system',
        content: [
          {
            type: 'text',
            text: 'Reescribe únicamente el CTA, el resultado debe ser del tipo: \n\n“Sígueme si eres (persona específica) para  (adaptación) (resultado)”\n\nTodas orientadas a seguir el contenido. La idea es incentivar la función "seguir"'
          }
        ]
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: '[Hook]  \\\\n¿Por qué la disciplina es más poderosa que la motivación?  \\\\n[/Hook]  \\\\n\\\\n[Contenido]  \\\\nLa motivación puede ser efímera; un día está en su punto más alto y al siguiente puede desvanecerse. Sin embargo, la disciplina es la verdadera clave del éxito a largo plazo. La disciplina es el hábito de seguir adelante incluso cuando no tienes ganas, y es lo que separa a los que logran sus objetivos de los que simplemente lo intentan. La disciplina te mantendrá avanzando, paso a paso, incluso en los días más desafiantes.  \\\\n[/Contenido]  \\\\n\\\\n[CTA]  \\\\nSi buscas desarrollar una disciplina inquebrantable, comenta \\\\\\"DISCIPLINA\\\\\\'
          }
        ]
      },
      {
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: '"Sígueme si eres una persona dedicada a alcanzar tus metas para aprender a desarrollar una disciplina inquebrantable y lograr el éxito a largo plazo."'
          }
        ]
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `[Hook]  \n${hook}\n[/Hook]\n\n[Contenido]\n${contenido}\n[/Contenido]\n\n[CTA]\n${cta}\n[/CTA]`
          }
        ]
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

export const improveCTACompartidos = async ({
  hook,
  contenido,
  cta
}: {
  hook: string
  contenido: string
  cta: string
}) => {
  const response = await openAI.chat.completions.create({
    model: 'gpt-4o-2024-08-06',
    messages: [
      {
        role: 'system',
        content: [
          {
            type: 'text',
            text: 'Reescribe únicamente el CTA, el resultado debe ser del tipo: \n\n“Comparte con (persona específica) para que (adaptación) (resultado)”\n\nTodas orientadas a COMPARTIR el contenido. La idea es incentivar la función "COMPARTIR" a personas.'
          }
        ]
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `[Hook]  \n${hook}\n[/Hook]\n\n[Contenido]\n${contenido}\n[/Contenido]\n\n[CTA]\n${cta}\n[/CTA]`
          }
        ]
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

export const improveCTAGuardados = async ({
  hook,
  contenido,
  cta
}: {
  hook: string
  contenido: string
  cta: string
}) => {
  const response = await openAI.chat.completions.create({
    model: 'gpt-4o-2024-08-06',
    messages: [
      {
        role: 'system',
        content: [
          {
            type: 'text',
            text: 'Reescribe únicamente el CTA, el resultado debe ser del tipo: \n\n“(Unión con moraleja) + si quieres (deseo de tu parte) + (accion que quieres que haga)”\n\nTodas orientadas a GUARDAR el contenido una palabra clave. La idea es incentivar la función "GUARDAR".'
          }
        ]
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: '[Hook]  \\n¿Por qué la disciplina es más poderosa que la motivación?  \\n[/Hook]  \\n\\n[Contenido]  \\nLa motivación puede ser efímera; un día está en su punto más alto y al siguiente puede desvanecerse. Sin embargo, la disciplina es la verdadera clave del éxito a largo plazo. La disciplina es el hábito de seguir adelante incluso cuando no tienes ganas, y es lo que separa a los que logran sus objetivos de los que simplemente lo intentan. La disciplina te mantendrá avanzando, paso a paso, incluso en los días más desafiantes.  \\n[/Contenido]  \\n\\n[CTA]  \\nSi buscas desarrollar una disciplina inquebrantable, comenta \\"DISCIPLINA\\".  \\n[/CTA]'
          }
        ]
      },
      {
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: 'La disciplina es la clave del éxito; si quieres seguir avanzando hacia tus objetivos, guarda este contenido para inspirarte en los días más desafiantes.'
          }
        ]
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `[Hook]  \n${hook}\n[/Hook]\n\n[Contenido]\n${contenido}\n[/Contenido]\n\n[CTA]\n${cta}\n[/CTA]`
          }
        ]
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

export const improveCTAComentarios = async ({
  hook,
  contenido,
  cta
}: {
  hook: string
  contenido: string
  cta: string
}) => {
  const response = await openAI.chat.completions.create({
    model: 'gpt-4o-2024-08-06',
    messages: [
      {
        role: 'system',
        content: [
          {
            type: 'text',
            text: 'Reescribe únicamente el CTA, el resultado debe ser del tipo: \n\n“(Unión con moraleja) + si quieres (deseo de tu parte) + (accion que quieres que haga)”\n\nTodas orientadas a COMENTAR una palabra clave. La idea es incentivar los comentarios.'
          }
        ]
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: '[Hook]  \n¿Por qué la disciplina es más poderosa que la motivación?  \n[/Hook]  \n\n[Contenido]  \nLa motivación puede ser efímera; un día está en su punto más alto y al siguiente puede desvanecerse. Sin embargo, la disciplina es la verdadera clave del éxito a largo plazo. La disciplina es el hábito de seguir adelante incluso cuando no tienes ganas, y es lo que separa a los que logran sus objetivos de los que simplemente lo intentan. La disciplina te mantendrá avanzando, paso a paso, incluso en los días más desafiantes.  \n[/Contenido]  \n\n[CTA]  \nSi buscas desarrollar una disciplina inquebrantable, comenta "DISCIPLINA".  \n[/CTA]'
          }
        ]
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `[Hook]  \n${hook}\n[/Hook]\n\n[Contenido]\n${contenido}\n[/Contenido]\n\n[CTA]\n${cta}\n[/CTA]`
          }
        ]
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

export const improveContenidoConPromesa = async ({
  hook,
  contenido,
  cta
}: {
  hook: string
  contenido: string
  cta: string
}) => {
  const response = await openAI.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: [
          {
            type: 'text',
            text: `Mejora este contenido de mi guión, hazlo más simple de entender. Hay dos tipos de guiones: de información, y de enumeración. El usuario te proveerá el hook, contenido y cta, tu tarea es modificar el CONTENIDO y retornar únicamente el CONTENIDO mejorado. No elimines detalles. 

              Para el caso de guiones información:
              Separa en parrafos más simples la información, escribela con palabras más sencillas. Hazlo fácil de entender, rápido y sin perder detalles. No utilices terminología técnica, solo texto fácil de leer. 

              Para el caso de guiones enumeración: 
              Si es el hook sugiere un número tipo enumerable, ponle número a cada parte y espaciarlo. Que sea corto, fácil de entender para el 90% de la población y que sea súper simple. 

              En ambos casos, agrega una promesa al inicio del contenido. La intención es generar una interacción extra o retención, por lo que debe ser muy persuasiva. Ejemplos de promesa: 
              * "La última X es la que Z..".
              * "Guarda este video por si se te olvida"
              * "El tercero es el que más comete la gente.."
              * "Si no puedes recordarlo, guarda el video para que no se te olvide".

              Es importante que la promesa esté al INICIO, y NUNCA se debe repetir con el cta. 

              Ejemplo de respuesta JSON: 
              CONTENIDO_MEJORADO: 'Texto del contenido mejorado'`
          }
        ]
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `[Hook]  \n${hook}\n[/Hook]\n\n[Contenido]\n${contenido}\n[/Contenido]\n\n[CTA]\n${cta}\n[/CTA]`
          }
        ]
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

export const improveContenidoSinPromesa = async ({
  hook,
  contenido,
  cta
}: {
  hook: string
  contenido: string
  cta: string
}) => {
  const response = await openAI.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: [
          {
            type: 'text',
            text: `Mejora este contenido de mi guión, hazlo más simple de entender. Hay dos tipos de guiones: de información, y de enumeración. El usuario te proveerá el hook, contenido y cta, tu tarea es modificar el CONTENIDO y retornar únicamente el CONTENIDO mejorado. No elimines detalles. 

            Para el caso de guiones información:
            Separa en parrafos más simples la información, escribela con palabras más sencillas. Hazlo fácil de entender, rápido y sin perder detalles. No utilices terminología técnica, solo texto fácil de leer. 

            Para el caso de guiones enumeración: 
            Si es el hook sugiere un número tipo enumerable, ponle número a cada parte y espaciarlo. Que sea corto, fácil de entender para el 90% de la población y que sea súper simple.`
          }
        ]
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `[Hook]  \n${hook}\n[/Hook]\n\n[Contenido]\n${contenido}\n[/Contenido]\n\n[CTA]\n${cta}\n[/CTA]`
          }
        ]
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
