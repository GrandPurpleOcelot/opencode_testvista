import { cmd } from "./cmd"
import * as prompts from "@clack/prompts"
import { UI } from "../ui"
import path from "path"

// List of test requirement files (could be dynamically generated)
const testFiles = [
  "packages/opencode/test/tool/bash.test.ts",
  "packages/opencode/test/tool/edit.test.ts",
  "packages/opencode/test/tool/tool.test.ts",
  "packages/opencode/test/bun.test.ts",
]

export const TestCommand = cmd({
  command: "test",
  describe: "Run Playwright MCP test with requirements file",
  async handler() {
    UI.empty()
    prompts.intro("Playwright MCP Test")

    // 1. Dropdown for test requirement file
    const file = await prompts.select({
      message: "Select the testing requirement file",
      options: testFiles.map((f) => ({
        label: path.basename(f),
        value: f,
        hint: f,
      })),
    })
    if (prompts.isCancel(file)) throw new UI.CancelledError()

    // 2. Prompt for Playwright MCP URL
    const url = await prompts.text({
      message: "Enter the Playwright MCP testing URL",
      placeholder: "e.g., http://localhost:3000",
      validate: (x) => (x && x.length > 0 ? undefined : "Required"),
    })
    if (prompts.isCancel(url)) throw new UI.CancelledError()

    prompts.log.info(`Selected file: ${file}`)
    prompts.log.info(`Playwright MCP URL: ${url}`)
    prompts.outro("Ready to run Playwright MCP test!")
  },
})
