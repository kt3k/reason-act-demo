// 例として OpenAI SDK を使用
import OpenAI from "openai"
const client = new OpenAI()

const goal = process.argv.slice(2).join(" ")

if (!goal) {
  console.log(`Usage: node --env-file=.env main.ts <npm package description...>

  Example:
    node --env-file=.env main.ts best date time package for frontend dev
    deno --env -NE main.ts best date time package for frontend dev`)
  process.exit()
}
console.log("Package requirement:", goal)

/** LLM call */
async function generate(input: string) {
  const res = await client.responses.create({ model: "gpt-5.4-mini", input })
  return res.output_text
}

const SYSTEM_PROMPT = `
# General rule
You are a npm package selection agent.

Your job is to choose the best npm package for the user's requirements.
- Collect missing information using tools
- Call one tool each time
- Observe the result
- Continue until you can make a recommendation

Rules:
- Prefer actively maintained packages
- Prefer packages with healthy adoption (many downloads)
- Prefer packages with clear TypeScript support
- Mention tradeoffs, not only the winner

Output format:
Thought: ...
Act: {"tool":"toolName","arg":"string"}

Available tools:
- search: search npm registry
  - example: {"tool":"search","arg":"query string"}
  - Note: npm search only support search by main topic
    - good search arg: "date", "markdown", "http client"
    - bad search arg: "npm date time library frontend TypeScript popular maintained"
- get_info: get package info including
  - example: {"tool":"get_info","arg":"package-name"}
  - the correct version number can be only obtained by this tool

Or, when finished:
Answer: {
  "recommended": "...",
  "latestVersion": "x.y.z",
  "license": "license name",
  "alternatives": ["..."],
  "reasons": ["..."],
  "tradeoffs": ["..."]
}

# User requirements
${goal}

# Steps
`

type Action =
  | { tool: "search"; arg: string }
  | { tool: "get_info"; arg: string }

type StepResult =
  | { answer: string }
  | { thought: string; act: Action }

async function searchTool(query: string) {
  const res = await fetch(
    "https://api.npmjs.org/search?text=" + query + "&size=100",
  )
  const { objects } = await res.json()
  return objects.map((o: any) => ({
    downloads: o.downloads.weekly,
    dependents: o.dependents,
    name: o.package.name,
  }))
}

async function getInfoTool(pkg: string) {
  const res = await fetch("https://registry.npmjs.org/" + pkg)
  const info = await res.json()
  return {
    name: info.name,
    description: info.description,
    license: info.license,
    readme: info.readme?.slice(0, 3000),
    latestVersion: info?.["dist-tags"]?.latest,
  }
}

function parse(text: string): StepResult {
  const answer = text.match(/(?<=Answer:).*$/s)
  if (answer) {
    try {
      return { answer: JSON.parse(answer[0]) }
    } catch {
      throw new Error("Cannot parse LLM answer: " + text)
    }
  }
  const thought = text.match(/(?<=Thought:).*?(?=Act:)/s)
  if (!thought) {
    throw new Error("Cannot parse LLM thought: " + text)
  }
  const actText = text.match(/(?<=Act:).*$/s)
  if (!actText) {
    throw new Error("Cannot parse LLM action: " + text)
  }
  let act: Action
  try {
    act = JSON.parse(actText[0])
  } catch {
    throw new Error("Cannot parse LLM action: " + text)
  }
  return {
    thought: thought[0].trim(),
    act,
  }
}

const messages = [SYSTEM_PROMPT]

// 最大ループ数
const MAX_ATTEMPT = 10

for (let i = 0; i < MAX_ATTEMPT; i++) {
  const result = parse(await generate(messages.join("\n")))

  if ("answer" in result) {
    console.log("Answer:", result.answer)
    break
  }
  const { thought, act } = result
  console.log("Thought:", thought)
  console.log("Act:", act)

  messages.push("Thought: " + thought, "Act: " + JSON.stringify(act))

  let observation: string
  switch (act.tool) {
    case "search": {
      observation = JSON.stringify(await searchTool(act.arg))
      break
    }
    case "get_info": {
      observation = JSON.stringify(await getInfoTool(act.arg))
      break
    }
    default:
      act satisfies never
      throw new Error("Unknown tool " + JSON.stringify(act))
  }
  console.log("Observation: ", observation!.slice(0, 100) + "...")
  messages.push("Observation: " + observation)
}
