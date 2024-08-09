import { openAI } from './client'

export const translateText = async ({
  text,
  toLanguage,
  addedSuggestions
}: {
  text: string
  toLanguage: string
  addedSuggestions?: string
}) => {
  const translation = await openAI.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You will be provided with a sentence in any language, you have to detect which one is it, translate it into ${toLanguage}. You also have to improve the punctuation marks.
        If there are any errors in the sentence, you should correct them, provide '/n' when there is a new line
        ${
          addedSuggestions
            ? `Here are some added suggestions for you to take account when doing the translation and fixing the text: ${addedSuggestions}`
            : ''
        }`
      },
      {
        role: 'user',
        content: `The text provided is this: ${text}. If the text is already in the language you want to translate it to, improve it and make it more readable and digestible, but dont tell me the language.`
      }
    ],
    temperature: 0.8,
    top_p: 1
  })
  return translation.choices[0].message.content
}

export const translateMedia = async ({
  text,
  toLanguage,
  addedSuggestions
}: {
  text: string
  toLanguage: string
  addedSuggestions?: string
}) => {
  const translation = await openAI.chat.completions.create({
    model: 'gpt-4-1106-preview',
    messages: [
      {
        role: 'system',
        content: `You will be provided with a sentence in any language, you have to detect which one is it, translate it into ${toLanguage}. You also have to improve the punctuation marks.
        Separate the HOOK, the BODY and the CTA very well with line breaks.
        Make the script easier to read, making it interesting and more digestible.
        If there are any errors in the sentence, you should correct them, provide '/n' when there is a new line
        ${
          addedSuggestions
            ? `Here are some added suggestions for you to take account when doing the translation and fixing the text: ${addedSuggestions}`
            : ''
        }`
      },
      {
        role: 'user',
        content: `The text provided is this: ${text}. If the text is already in the language you want to translate it to, improve it and make it more readable and digestible, but dont tell me the language.`
      }
    ],
    temperature: 0.8,
    top_p: 1
  })
  return translation.choices[0].message.content
}

export const translateQuery = async ({
  text,
  toLanguage
}: {
  text: string
  toLanguage: string
}) => {
  const translation = await openAI.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `You will be provided with a sentence in any language, you have to detect which one is it, translate it into ${toLanguage}. It will be a search query so you have to only translate the query and return the text, just the text, do not improve the sentence.`
      },
      {
        role: 'user',
        content: `${text}`
      }
    ],
    temperature: 0.8,
    top_p: 1
  })
  return translation.choices[0].message.content
}

export const translateInstagramQuery = async ({
  query,
  toLanguage
}: {
  query: string
  toLanguage: string
}) => {
  const translation = await openAI.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You will be provided with a sentence in any language, you have to detect which one is it, translate it into ${toLanguage}. It will be an instagram search query so you have to only translate it thinking in the best suitable translation given they are for an instagram search and can be with hashtags, you have to only translate and return the query, do not improve the sentence, and if it has any hashtags remove them.`
      },
      {
        role: 'user',
        content: `${query}`
      }
    ],
    temperature: 0.8,
    top_p: 1
  })
  return translation.choices[0].message.content
}
