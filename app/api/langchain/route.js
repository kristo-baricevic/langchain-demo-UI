import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";

//run the prompt through the LLM chain
const runLLMChain = async (prompt) => {
    const encoder = new TextEncoder();

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    const model = new ChatOpenAI({
        streaming: true,
        callbacks: [
            {
                async handleLLMNewToken(token) {
                    await writer.ready;
                    await writer.write(encoder.encode(`${token}`));
                },
                async handleLLMEnd(){
                    await writer.ready;
                    await writer.close();
                },
            },
        ],
    });

    model.call([new HumanMessage(prompt)]);

    return stream.readable;
};


//The request holds the prompt value, which is sent from the handleSubmit on page.js
export async function POST(req){
    const {prompt} = await req.json();

    const stream = runLLMChain(prompt);

    return new Response(await stream);
};