import re

with open("src/ai-feature/ui.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Add a flag for the listener
if "let isListenerAdded = false;" not in content:
    content = content.replace("export function initInterlocutorPanel(container: HTMLElement): void {", 
"""let isListenerAdded = false;

export function initInterlocutorPanel(container: HTMLElement): void {
    container.innerHTML = ""; // Clear existing content on re-init
""")

    # Add the listener at the end of the function
    # The function ends with:
    #             elaborateBtn.style.display = 'inline-block'; // Garante que o botão reapareça
    # 
    #         }, 1000); // Simulando o tempo de resposta do Cérebro
    #     }
    # });
    # }

    end_str = """        }
    });"""
    new_end_str = """        }
    });

    if (!isListenerAdded) {
        window.addEventListener("languageChanged", () => {
            initInterlocutorPanel(container);
        });
        isListenerAdded = true;
    }"""
    content = content.replace(end_str, new_end_str)

    with open("src/ai-feature/ui.ts", "w", encoding="utf-8") as f:
        f.write(content)
