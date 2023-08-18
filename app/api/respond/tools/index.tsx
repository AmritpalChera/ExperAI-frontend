import callChatGpt from "@/utils/openai/responder";
import mindplug from "@/utils/setup/mindplug";


enum ToolsType {
  WEB = '<web>',
  NOTHING = '<nothing>',
}

enum ToolsDescription {
  WEB = `use web browser to search for latest data and guidelines. To use it, reply with ${ToolsType.WEB}`,
  NOTHING = `use nothing for common searches not requiring the internet. Reply with ${ToolsType.NOTHING}`
};

const getTool = async (input: string) => {
  const template = `
    You have 2 options to answer the given input.

    Option 1: ${ToolsDescription.WEB}
    Option 2: ${ToolsDescription.NOTHING}

    To use Option 1: reply ${ToolsType.WEB}
    To use Option 2: reply ${ToolsType.NOTHING}

    Rule: Keep to minimum words.

    You can only answer with given options.

    input: ${input}
  `;

  let tool = await callChatGpt({ search: template });
  if (!tool) tool = ToolsType.NOTHING
  return tool;
}

export const handleTools = async (tool: string, userInput: string) => {
  // for now only one tool is supported per request
  const useWeb = tool.includes('<web>');
  if (!useWeb) return {};
  else {
    let data = await mindplug.searchWeb({ search: userInput }).catch(err => {
        console.log(err)
        return {};
      });
    return {
      type: 'web',
      data: data
    }
  }
}

export default getTool;