import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface GeneratorParams {
  url: string;
  description: string;
  pageType: string;
  category: string;
  customInfo?: string;
}

export interface GeneratedContent {
  html: string;
  metaDescription: string;
}

export async function generatePageContent(params: GeneratorParams): Promise<GeneratedContent> {
  const model = "gemini-3.1-pro-preview";
  
  const prompt = `
    You are an expert web developer and SEO specialist.
    
    **Task:**
    1. **Analyze:** First, use Google Search to analyze the provided Blog URL (${params.url}) to understand its niche, tone, and existing content. If the site is new/empty, rely on the provided description.
    2. **Generate:** Create a premium, high-quality, AdSense-optimized HTML page based on your analysis and the user's inputs.

    **Input Details:**
    - **Blog URL:** ${params.url}
    - **Blog Description:** ${params.description}
    - **Page Type:** ${params.pageType}
    - **Category:** ${params.category}
    - **Custom Info:** ${params.customInfo || "None"}

    **Requirements:**
    1. **Output Format:** Return a JSON object with two fields:
       - "html": The raw HTML code for the body content. Do NOT include <html>, <head>, or <body> tags.
       - "metaDescription": A highly optimized, click-worthy meta description (max 160 characters) for this specific page.
    2. **Styling:** Use **INLINE CSS ONLY**. Do not use <style> blocks or external stylesheets. The design must be modern, clean, trustworthy, and premium. Use a sophisticated color palette (dark text on light background for readability, with subtle accent colors).
    3. **Content:**
       - Must be **100% original, human-style, and valuable**.
       - **Length:** Minimum 600 words. This is critical for SEO.
       - **Tone:** Professional, authoritative, yet accessible. Match the analyzed tone of the blog if possible.
       - **Structure:** Use semantic HTML (<h1>, <h2>, <p>, <ul>, <li>, <strong>, <blockquote>).
       - Include specific details relevant to the "${params.category}" category.
    4. **Specific Page Requirements:**
       - If "About Us": 
         - Focus on expertise, authority, and trust (E-E-A-T).
         - **Include one high-quality relevant image** using this format: <img src="https://picsum.photos/800/400?random=1" alt="About Us" referrerPolicy="no-referrer" style="width:100%; border-radius: 8px; margin-bottom: 20px;">
       - If "Privacy Policy": Include GDPR/CCPA compliance wording, cookie usage (AdSense), and data collection details.
       - If "Contact Us": 
         - Include a professional layout for contact info.
         - **Include one high-quality relevant image** using this format: <img src="https://picsum.photos/800/400?random=2" alt="Contact Us" referrerPolicy="no-referrer" style="width:100%; border-radius: 8px; margin-bottom: 20px;">
       - If "Disclaimer": Clear liability limits.
       - If "Terms & Conditions": Standard legal usage rules.
       - If "Affiliate Disclosure": Clear transparency.
       - **For all other page types:** Do NOT include any images.
    5. **Design Constraints:**
       - NO logo, NO navigation menu, NO footer (these are provided by the blog theme).
       - Add smooth scrolling behavior if using internal links.
       - Use responsive widths (max-width: 800px; margin: 0 auto;).
       - Typography: Use system fonts stack (Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif) to ensure compatibility.
    
    **Goal:** The user wants to copy-paste this code directly into Blogger to get AdSense approval. The page must look "crafted" and "expensive".
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No content generated");
    }

    const json = JSON.parse(text);
    return {
      html: json.html,
      metaDescription: json.metaDescription
    };
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}
