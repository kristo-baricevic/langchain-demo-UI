"use client";

import { useState } from "react";

export default function Home() {
  const [streamedData, setStreamedData] = useState("");

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    setStreamedData("");

    const formData = new FormData(e.currentTarget);

    const response = await fetch("api/langchain", {
      method: "POST",
      body: JSON.stringify({
        prompt: formData.get("prompt"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    console.log("response", response);
    console.log("response body", response.body);

    const reader = response.body.getReader();

    while(true) {
      const { done, value } = await reader.read();

      if(done){
        break;
      }

      const text = new TextDecoder().decode(value);
      setStreamedData((prevData) => prevData + text);
    }
  };

 

  const handleClearChat = () => {
    setStreamedData("");
  };

  return (
    <main className="flex max-w-6xl mx-auto items-center justify-center p-12 bg-blue-500">
      <div className="border-blue-800 border-solid border-4 rounded-xl px-4 py-8 bg-red-300 shadow-lg">
        <div className="flex flex-col gap-12 border-blue-800 border-solid rounded-xl border-4 py-4 px-4 bg-blue-200 shadow-md">
          <h1 className="text-slate-600 font-extrabold text-6xl text-center">
            Chatbot Demo
          </h1>
          <form onSubmit={handleChatSubmit}>

            <input 
              className="py-2 px-4 rounded-lg border-black border-2 border-solid bg-gray-200 text-black w-full"
              placeholder="enter prompt"
              name="prompt"
              required
              >
              </input>

              <div className="flex justify-center gap-4 px-4 py-4">
                <button 
                  type="submit" 
                  className="py-2 px-4 rounded-full text-sm bg-blue-700 text-white hover:opacity-80 transition-opacity shadow-md">
                    Send Chat
                </button>

                <button 
                  type="button" 
                  onClick={handleClearChat}
                  className="py-2 px-4 rounded-md text-sm bg-black text-white hover:opacity-80 transition-opacity shadow-lg">
                    Clear Chat
                </button>

              </div>
          </form>

          {streamedData && (
            <div>
              <h3 className="text-2xl py-2 text-slate-800">Chatbot Response</h3>
              <p className="text-gray-200 rounded-md bg-gray-700 p-4">
                {streamedData}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
