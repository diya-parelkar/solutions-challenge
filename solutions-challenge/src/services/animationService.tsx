import { GoogleGenerativeAI } from "@google/generative-ai";

interface AnimationPlaceholder {
  searchTerm: string;
  detailedPrompt: string;
  caption?: string;
}

interface AnimationResult {
  type: 'phet';
  embedUrl: string;
  caption: string;
  source: string;
}

class AnimationService {
  private readonly PHET_SIMULATIONS: Record<string, string> = {
    // Physics
    'static electricity': 'balloons-and-static-electricity',
    'electricity': 'circuit-construction-kit-dc',
    'circuit': 'circuit-construction-kit-dc',
    'force': 'forces-and-motion-basics',
    'motion': 'forces-and-motion-basics',
    'gravity': 'gravity-and-orbits',
    'orbit': 'gravity-and-orbits',
    'pendulum': 'pendulum-lab',
    'oscillation': 'pendulum-lab',
    
    // Chemistry
    'chemical equation': 'balancing-chemical-equations',
    'molecule': 'build-a-molecule',
    'matter': 'states-of-matter',
    'acid': 'acid-base-solutions',
    'base': 'acid-base-solutions',
    'concentration': 'concentration',
    
    // Biology
    'evolution': 'natural-selection',
    'selection': 'natural-selection',
    'gene': 'gene-expression-essentials',
    'expression': 'gene-expression-essentials',
    
    // Earth Science
    'solar system': 'my-solar-system',
    'planet': 'my-solar-system',
    'tectonics': 'plate-tectonics',
    'plate': 'plate-tectonics',
    
    // Mathematics
    'rate': 'unit-rates',
    'area': 'area-builder',
    'fraction': 'fraction-matcher',
    'graph': 'graphing-lines',
    'line': 'graphing-lines',
    'proportion': 'proportion-playground'
  };

  async processAnimationPlaceholders(content: string): Promise<string> {
    // Extract animation placeholders
    const placeholderRegex = /\[animation:\s*([^:]+)\s*:\s*([^\]]+)\]/g;
    const placeholders: AnimationPlaceholder[] = [];
    let match;

    console.log("🔍 Processing content for animation placeholders");
    console.log("📄 Content length:", content.length);
    console.log("🔎 Looking for animation placeholders...");

    while ((match = placeholderRegex.exec(content)) !== null) {
      console.log("✅ Found animation placeholder:", {
        searchTerm: match[1].trim(),
        detailedPrompt: match[2].trim()
      });
      placeholders.push({
        searchTerm: match[1].trim(),
        detailedPrompt: match[2].trim()
      });
    }

    console.log(`📊 Found ${placeholders.length} animation placeholders`);

    // Process each placeholder
    for (const placeholder of placeholders) {
      console.log("🔄 Processing animation:", placeholder);
      try {
        const animation = await this.findPhETSimulation(placeholder);
        if (animation) {
          console.log("✅ Animation found:", animation);
          // Replace placeholder with actual animation
          const placeholderHtml = this.createAnimationHtml(animation);
          content = content.replace(
            `[animation: ${placeholder.searchTerm} : ${placeholder.detailedPrompt}]`,
            placeholderHtml
          );
        } else {
          console.warn("⚠️ No PhET simulation found for:", placeholder.searchTerm);
        }
      } catch (error) {
        console.error("❌ Error processing animation:", error);
      }
    }

    return content;
  }

  private async findPhETSimulation(placeholder: AnimationPlaceholder): Promise<AnimationResult | null> {
    try {
      console.log("🔍 Searching for PhET simulation:", placeholder.searchTerm);
      
      // Convert search terms to lowercase for matching
      const searchTerms = placeholder.searchTerm.toLowerCase().split(' ');
      let matchingSimulation = null;
      
      // Find matching simulation
      for (const [key, simId] of Object.entries(this.PHET_SIMULATIONS)) {
        if (searchTerms.some(term => key.includes(term))) {
          matchingSimulation = simId;
          break;
        }
      }

      if (matchingSimulation) {
        console.log("✅ Found matching PhET simulation:", matchingSimulation);
        const embedUrl = `https://phet.colorado.edu/sims/html/${matchingSimulation}/latest/${matchingSimulation}_en.html`;
        return {
          type: 'phet',
          embedUrl,
          caption: placeholder.detailedPrompt,
          source: 'PhET Interactive Simulations'
        };
      }

      console.warn("⚠️ No matching PhET simulation found for:", placeholder.searchTerm);
      return null;
    } catch (error) {
      console.error("❌ Error finding PhET simulation:", error);
      return null;
    }
  }

  private createAnimationHtml(animation: AnimationResult): string {
    if (!animation || !animation.embedUrl) {
      console.warn("⚠️ Invalid animation data:", animation);
      return '';
    }

    return `
      <div class="content-animation my-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            <img src="https://cdn.jsdelivr.net/gh/icons8/flat-color-icons@master/svg/movie.svg" class="flat-color-icon" alt="Animation icon" />
            ${animation.caption}
          </h4>
        </div>
        <div class="animation-container">
          <iframe 
            src="${animation.embedUrl}" 
            class="w-full h-[400px] border-0 rounded-lg"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
        <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Source: ${animation.source}
        </p>
      </div>
    `;
  }
}

export const animationService = new AnimationService(); 