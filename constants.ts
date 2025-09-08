export const SCULPTURE_PROMPT = `
You are an expert sculptor. Your task is to transform the provided image into a photorealistic, classical-style marble sculpture.

**Instructions:**
1.  **Analyze the subject:** Identify the main subject(s) of the image.
2.  **Convert to Marble:** Re-render the entire image as if it were carved from a single block of pristine white Carrara marble.
3.  **Texture and Detail:** The texture should be smooth but with subtle, realistic marble grain. Capture the fine details of the original image in the sculpture's form.
4.  **Lighting:** The sculpture should be lit with dramatic, soft studio lighting (chiaroscuro) to emphasize its form and contours. The background should be a simple, dark, out-of-focus studio setting.
5.  **Realism:** The final output must be a photorealistic image of the marble sculpture, not a digital-looking render. It should look like a real photograph of a physical object.
6.  **Output:** Provide only the final image. Do not include any text, descriptions, or commentary.
`;

export const REFINE_PROMPT_TEMPLATE = (refinement: string) => `
Based on the sculpture you've already created, please apply the following refinement: "${refinement}".

Maintain the existing style, lighting, and composition. Only modify the sculpture according to the request. The output should be a new, photorealistic image of the refined sculpture. Do not add any text.`;

export const loadingMessages = [
  'Chiseling the fine details...',
  'Polishing the marble...',
  'Setting up studio lighting...',
  'Consulting the muses...',
  'Carving with digital precision...',
];

export const RANDOM_IMAGE_PROMPT_TEMPLATE = (item: string) => `
Photorealistic, studio-lit portrait of ${item}.
The subject should be the central focus, sharply detailed.
The background should be a clean, simple, dark, out-of-focus studio setting.
The lighting should be dramatic and soft, creating depth and highlighting textures.
High resolution, 8K, professional photography.
`;

export const RANDOM_ITEM_PROMPTS = [
  'a vintage film camera',
  'a steaming cup of artisanal coffee',
  'a collection of antique skeleton keys',
  'a perfectly ripe avocado, sliced in half',
  'a stack of old, leather-bound books',
  'a complex mechanical watch movement',
  'a blooming sakura blossom branch',
  'a detailed, colorful macaw feather',
  'a melting ice cream cone',
  'a retro-futuristic ray gun',
  'a crystal ball reflecting a galaxy',
  'a single, perfect seashell on wet sand',
];
