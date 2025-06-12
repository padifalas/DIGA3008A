class ColorMoodGenerator {
    constructor() {
        this.apiUrl = 'http://colormind.io/api/';
        this.currentMood = 'developer';
        this.isGenerating = false;
        this.originalColors = null;
        
        // Curated color presets for different moods
        this.moodPresets = {
            developer: {
                name: "Developer Mode",
                description: "I see you're a developer. cool.",
                presets: [
                    {
                        name: "Terminal",
                        colors: [[15, 23, 42], [30, 41, 59], [51, 65, 85], [100, 116, 139], [148, 163, 184]],
                        description: "Dark terminal vibes"
                    },
                    {
                        name: "Matrix",
                        colors: [[4, 47, 46], [6, 78, 59], [16, 185, 129], [52, 211, 153], [167, 243, 208]],
                        description: "Pretend you're in the matrix"
                    },
                    {
                        name: "Code Blue",
                        colors: [[12, 32, 64], [30, 64, 128], [59, 130, 246], [147, 197, 253], [219, 234, 254]],
                        description: "VS code inspired blues"
                    }
                ]
            },
            writer: {
                name: "Writer Mode", 
                description: "Prose... prose... pretend this is a clever metaphor <3",
                presets: [
                    {
                        name: "Vintage Paper",
                        colors: [[92, 57, 33], [120, 113, 108], [168, 162, 158], [214, 211, 209], [250, 249, 246]],
                        description: "Warm browns and cream like aged paper"
                    },
                    {
                        name: "Purple Prose",
                        colors: [[67, 20, 100], [107, 33, 168], [124, 58, 237], [167, 139, 250], [221, 214, 254]],
                        description: "Royal purples for creative inspiration"
                    },
                    {
                        name: "Manuscript",
                        colors: [[45, 32, 25], [101, 85, 73], [139, 121, 94], [186, 175, 158], [245, 238, 227]],
                        description: "Warm manuscript tones"
                    }
                ]
            },
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.generatePresetsForMood(this.currentMood);
    }

    bindEvents() {
      
        const toggleBtn = document.getElementById('colorMoodToggle');
        const overlay = document.getElementById('colorMoodOverlay');
        const closeBtn = document.getElementById('closeMoodPopup');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.openPopup());
        }
        
        if (closeBtn || overlay) {
            const closeHandler = (e) => {
                if (e.target === overlay || e.target === closeBtn) {
                    this.closePopup();
                }
            };
            closeBtn?.addEventListener('click', closeHandler);
            overlay?.addEventListener('click', closeHandler);
        }


        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchMood(e.target.closest('.mood-btn').dataset.mood);
            });
        });


        const resetBtn = document.getElementById('resetColors');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetSiteColors());
        }

        // u can close popup using esc
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePopup();
            }
        });
    }

    openPopup() {
        const overlay = document.getElementById('colorMoodOverlay');
        if (overlay) {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closePopup() {
        const overlay = document.getElementById('colorMoodOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    switchMood(mood) {
        if (mood === this.currentMood) return;

        this.currentMood = mood;
        
        // will updatw active button
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mood === mood);
        });

   
        this.generatePresetsForMood(mood);
    }

    async generatePresetsForMood(mood) {
        const presetsContainer = document.getElementById('colorPresets');
        if (!presetsContainer) return;

        presetsContainer.innerHTML = '<div class="loading">Generating color variations...</div>';

        const moodData = this.moodPresets[mood];
        const presetsHTML = [];

        // generate variations for each preset
        for (let i = 0; i < moodData.presets.length; i++) {
            const preset = moodData.presets[i];
            
            // i made it that it first try  to get new colors from api , then fallback to original if fails
            let colors = preset.colors;
            try {
                const apiColors = await this.getColorVariation(preset.colors);
                if (apiColors && apiColors.length === 5) {
                    colors = apiColors;
                }
            } catch (error) {
                console.log(`Using fallback colors for ${preset.name}`);

                // make a slight variation of the original
                colors = this.createColorVariation(preset.colors);
            }

            const presetHTML = this.createPresetHTML(preset.name, colors, preset.description);
            presetsHTML.push(presetHTML);
        }

        // add a more extra api variations
        try {
            const extraVariations = await this.generateExtraVariations(moodData.presets);
            presetsHTML.push(...extraVariations);
        } catch (error) {
            console.log('doesnt get frm api damnnn');
        }

        presetsContainer.innerHTML = presetsHTML.join('');
        this.bindPresetEvents();
    }

    async generateExtraVariations(basePresets) {
        const variations = [];
        const variationNames = ['Variation A', 'Variation B', 'Fresh Mix'];
        
        for (let i = 0; i < Math.min(2, basePresets.length); i++) {
            try {
                const baseColors = basePresets[i].colors;
                const apiColors = await this.getColorVariation(baseColors, 'random');
                
                if (apiColors && apiColors.length === 5) {
                    const variationHTML = this.createPresetHTML(
                        variationNames[i] || `Variation ${i + 1}`, 
                        apiColors, 
                        'mood variation from colormind api'
                    );
                    variations.push(variationHTML);
                }
            } catch (error) {
                console.log(`my goooodd failed to generate variation ${i}`);
            }
        }

        return variations;
    }

    async getColorVariation(baseColors, mode = 'guided') {
        console.log('trying API call with colors:', baseColors);
        
        try {
            let requestBody;
            
            if (mode === 'random') {
                
                requestBody = {
                    model: "default"
                };
            } else {
            
                const firstColor = baseColors[0];
                const lastColor = baseColors[baseColors.length - 1];
                
                requestBody = {
                    model: "default",
                    input: [firstColor, "N", "N", "N", lastColor]
                };
            }

            // first try direct api call 
            let response;
            try {
                response = await fetch(this.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });
            } catch (corsError) {
                console.log('direct api didnt work , (sad) trying with CORS proxy');

                // added fallback if api dont work to CORS proxy
                response = await fetch('https://cors-anywhere.herokuapp.com/' + this.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });
            }

            console.log(' resp:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
              
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            console.log('api workkkk:', data);
            return data.result;
            
        } catch (error) {
            console.error('api Call not work:', error);
            return null;
        }
    }

    createColorVariation(baseColors) {
       
        return baseColors.map((color, index) => {
            return color.map(value => {
      
                const variationRange = index < 2 ? 20 : 30; 
                const variation = Math.floor(Math.random() * variationRange * 2) - variationRange;
                return Math.max(0, Math.min(255, value + variation));
            });
        });
    }

    createPresetHTML(name, colors, description) {
        const colorsHTML = colors.map(color => {
            const [r, g, b] = color;
            const hex = this.rgbToHex(r, g, b);
            return `<div class="color-swatch" 
                         style="background-color: rgb(${r}, ${g}, ${b})" 
                         data-color="${hex}" 
                         title="${hex}"></div>`;
        }).join('');

        return `
            <div class="color-preset" data-colors='${JSON.stringify(colors)}'>
                <h4 class="preset-name">${name}</h4>
                <p class="preset-description">${description}</p>
                <div class="color-palette">
                    ${colorsHTML}
                </div>
                <button class="apply-preset-btn">
                    <i class="fas fa-paint-brush"></i> Apply ${name}
                </button>
            </div>
        `;
    }

    bindPresetEvents() {

        // thought itd be cool to copy color hex when u click 
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                e.stopPropagation();
                const color = e.target.dataset.color;
                this.copyToClipboard(color);
                this.showToast(`Copied ${color} to clipboard!`);
            });
        });

        // btns to apply the color preset/vibe
        document.querySelectorAll('.apply-preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.target.closest('.color-preset');
                const colors = JSON.parse(preset.dataset.colors);
                const presetName = preset.querySelector('.preset-name').textContent;
                this.applyColorsToSite(colors, presetName);
            });
        });

      
        const generateBtn = document.getElementById('generateNewColors');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                if (this.isGenerating) return;
                
                this.isGenerating = true;
                generateBtn.disabled = true;
                generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
                
                this.generatePresetsForMood(this.currentMood).then(() => {
                    this.isGenerating = false;
                    generateBtn.disabled = false;
                    generateBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Generate New Colors';
                }).catch(() => {
                    this.isGenerating = false;
                    generateBtn.disabled = false;
                    generateBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Generate New Colors';
                    this.showToast('Generation failed, using fallback colors');
                });
            });
        }
    }

    rgbToHex(r, g, b) {
        return "#" + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join("");
    }

    copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).catch(err => {
                this.fallbackCopyToClipboard(text);
            });
        } else {
            this.fallbackCopyToClipboard(text);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }
        
        document.body.removeChild(textArea);
    }

    showToast(message) {
   
        const existingToast = document.querySelector('.mood-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'mood-toast';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
    }

    applyColorsToSite(colors, presetName) {
        if (!colors || colors.length < 5) return;

        const [primary, secondary, tertiary, quaternary, background] = colors;
        const root = document.documentElement;
        
        // store  og values on first use
        if (!this.originalColors) {
            this.originalColors = {
                '--accent-color': getComputedStyle(root).getPropertyValue('--accent-color').trim(),
                '--secondary-accent': getComputedStyle(root).getPropertyValue('--secondary-accent').trim(),
                '--tertiary-accent': getComputedStyle(root).getPropertyValue('--tertiary-accent').trim(),
                '--main-bg-color': getComputedStyle(root).getPropertyValue('--main-bg-color').trim(),
                '--gradient-forest': getComputedStyle(root).getPropertyValue('--gradient-forest').trim(),
                '--gradient-sunset': getComputedStyle(root).getPropertyValue('--gradient-sunset').trim()
            };
        }

        // apply new colors
        root.style.setProperty('--accent-color', `rgb(${primary.join(',')})`);
        root.style.setProperty('--secondary-accent', `rgb(${secondary.join(',')})`);
        root.style.setProperty('--tertiary-accent', `rgb(${tertiary.join(',')})`);
        root.style.setProperty('--main-bg-color', `rgb(${background.join(',')})`);

        // apply gradients
        root.style.setProperty('--gradient-forest', 
            `linear-gradient(120deg, rgb(${primary.join(',')}), rgb(${secondary.join(',')}))`);
        root.style.setProperty('--gradient-sunset', 
            `linear-gradient(120deg, rgb(${tertiary.join(',')}), rgb(${quaternary.join(',')}))`);

        this.showToast(`${presetName} applied! 🎨`);
    }

    resetSiteColors() {
        if (!this.originalColors) {
            this.showToast('No colors to reset!');
            return;
        }

        const root = document.documentElement;
        
        // back to og colors
        Object.entries(this.originalColors).forEach(([property, value]) => {
            if (value) {
                root.style.setProperty(property, value);
            } else {
                root.style.removeProperty(property);
            }
        });

        this.originalColors = null;
        this.showToast('Colors reset! 🔄');
    }
}

// init when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // lil delay to ensure other scripts have loaded
    setTimeout(() => {
        const generator = new ColorMoodGenerator();
        
  
        window.colorMoodGenerator = generator;
    }, 300);
});

// might use in other pages
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ColorMoodGenerator;
}