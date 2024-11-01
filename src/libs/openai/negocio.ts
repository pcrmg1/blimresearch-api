import { openAI } from './client'
import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod'

const PreguntasSchema = z.object({
  preguntas: z.array(
    z.object({
      pregunta: z.string(),
      titulo: z.string(),
      descripcion: z.string()
    })
  )
})

export const PreguntasNegocioSchema = z.object({
  fortalezas: z.string(),
  debilidades: z.string(),
  debilidadesPosibles: z.string(),
  descripcion: z.string(),
  clienteIdeal: z.string(),
  tiempoResultados: z.string(),
  resultadosClientes: z.string(),
  resultadosGarantizados: z.string(),
  beneficioResultado: z.string(),
  objecionesPrincipales: z.string(),
  formulaPresentacion: z.string()
})

export const generarPreguntasNegocio = async ({
  fortalezas,
  debilidades,
  debilidadesPosibles,
  descripcion,
  clienteIdeal,
  tiempoResultados,
  resultadosClientes,
  resultadosGarantizados,
  beneficioResultado,
  objecionesPrincipales,
  formulaPresentacion
}: {
  fortalezas: string
  debilidades: string
  debilidadesPosibles: string
  descripcion: string
  clienteIdeal: string
  tiempoResultados: string
  resultadosClientes: string
  resultadosGarantizados: string
  beneficioResultado: string
  objecionesPrincipales: string
  formulaPresentacion: string
}) => {
  const response = await openAI.beta.chat.completions.parse({
    model: 'gpt-4o-mini-2024-07-18',
    messages: [
      {
        role: 'system',
        content: [
          {
            type: 'text',
            text: 'El usuario proveerá contexto sobre su negocio, y tu objetivo es hacer 15 preguntas específicas para conocer en profundidad el negocio. Tu objetivo es retornar las preguntas para este caso en específico. Las preguntas deben ir enfocadas en el NICHO del mercado del usuario.\n\nNo preguntes absolutamente NADA acerca de marketing y captación de leads. Las preguntas deben ser clave para diseñar un webinar enfocado en venta. Es importante entender que la idea es PROFUNDIZAR sobre el negocio para que, luego de responder estas preguntas, podamos armar un webinar. \n\nQue las preguntas sean muy personalizadas. Que incluyan parafraseando lo que el usuario provee como contexto, para hacer sentir al usuario que se generaron estas preguntas exclusivamente para este usuario. Puedes enfocarte ADAPTANDO estas preguntas:\n\n¿Qué aspecto innovador o poco común ofrece este producto/servicio?\n¿Cómo se diferencia de otros métodos o soluciones existentes en el mercado?\n¿Qué cambios recientes en la industria hacen posible esta nueva oportunidad?\n¿Cuál es el mayor deseo de tus clientes ideales en cuanto a resultados?\n¿Qué beneficios personales y emocionales buscan lograr al alcanzar su objetivo?\n¿Qué sueños o metas sienten que están cada vez más lejos de alcanzar sin una solución?\n¿Cuál es la metodología específica que usas y cómo difiere de otras?\n¿Qué lo hace especial o más efectivo que los métodos tradicionales?\n¿Qué evidencias o pruebas puedes mostrar para dar a entender su exclusividad y eficacia?\n¿Qué prueba o demostración puedes ofrecer para respaldar que no es "más de lo mismo"?\n¿Qué ejemplos o detalles sobre el funcionamiento del sistema puedes dar para despertar curiosidad?\n¿Cómo cambiaría la vida o negocio del cliente si implementa tu solución?\n¿Qué beneficios inmediatos y a largo plazo puede esperar?\n¿Qué problemas persistentes resolverá este nuevo mecanismo?\n¿Qué autoridad tienes o cómo la has demostrado en el pasado en este campo?\n¿Qué testimonios puedes compartir que validen tu método y tus resultados?\n¿Cómo podrías estructurar una historia de éxito usando la técnica “y, pero, por lo tanto”?\n¿Cuáles son los miedos o bloqueos más comunes que enfrenta tu audiencia para tomar acción?\n¿Qué problemas personales o del negocio podrían estar dificultando sus avances actualmente?\n¿Cómo tu mecanismo único ayuda a superar específicamente estos obstáculos?\n¿Qué factores externos o enemigos en común puedes identificar y señalar?\n¿Cómo estos factores han sido una barrera continua para el éxito de tu audiencia?\n¿Qué urgencia actual (tendencia, cambio en el mercado, límite temporal) hace que tomar acción sea imperativo?\n¿Qué podrían perder si no aprovechan esta oportunidad en este momento?\n¿Qué dificultades similares a las de tu audiencia has experimentado personalmente?\n¿Cómo has sido afectado negativamente por el mismo "enemigo en común" que enfrenta tu audiencia?\n¿Cómo te has comprometido a ayudar a otros a superar estos problemas con tu método?\n¿Cuál es el proceso general para que el cliente alcance su meta?\n¿Cómo se ve el paso a paso y qué testimonios cortos o casos de éxito puedes compartir en cada etapa?\n¿Cuál es el primer paso que deben tomar para iniciar el proceso contigo?\n¿Qué recibirán o aprenderán en la primera llamada o consulta?\n¿Qué garantías o promesas puedes dar para minimizar el riesgo percibido por el cliente?\n¿Qué otros incentivos o beneficios puedes ofrecer para asegurarles que su tiempo e inversión están bien empleados?\n¿Por qué es importante que asistan a tiempo y no pospongan esta decisión?\n\n\n\n\n\n'
          }
        ]
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `\nEl contexto de mi negocio:\n\nÁreas de Fortaleza en negocios \n${fortalezas}\n\nÁreas de Debilidad/Posible \n${debilidades}\n\nÁreas de Debilidad/Posible mejora en negocios\n${debilidadesPosibles}\n\nDescripción de lo que vendes\n${descripcion}\n\nCliente ideal \n${clienteIdeal}\n\nTiempo para ver resultados:\n${tiempoResultados}\n\nResultados obtenidos por tus clientes:\n${resultadosClientes}\n\nResultados garantizados \n${resultadosGarantizados}\n\nBeneficio del resultado \n${beneficioResultado}\n\nObjeciones principales \n${objecionesPrincipales}\n\nFórmula de presentación \n${formulaPresentacion}\n`
          }
        ]
      }
    ],
    temperature: 1,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: zodResponseFormat(PreguntasSchema, 'preguntas')
  })
  return response.choices[0].message.parsed
}
