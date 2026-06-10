import axios from 'axios'

const STABILITY_ENDPOINT = 'https://api.stability.ai/v1/generation/stable-diffusion-xl/text-to-image'

export async function generateIllustration(prompt) {
  if (!process.env.STABILITY_API_KEY) {
    return null
  }

  try {
    const response = await axios.post(
      STABILITY_ENDPOINT,
      {
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 120000,
      }
    )
    const artifact = response.data?.artifacts?.[0]
    if (artifact?.base64) {
      return `data:image/png;base64,${artifact.base64}`
    }
  } catch (error) {
    console.error('stable-diffusion error', error?.response?.data || error?.message)
  }
  return null
}
